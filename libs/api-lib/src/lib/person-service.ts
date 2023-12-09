import { createPool, Pool } from 'mysql2/promise';
import { flow, pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import { last } from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { Either, isLeft, mapLeft } from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { formatValidationErrors } from 'io-ts-reporters';
import { countPersonSql, getNormalizePersonSql, getPersonSql, getSearch, PersonTable } from './person-table';
import {
  Childhood,
  ChildhoodC,
  Grandparents,
  Holiday,
  Item,
  items,
  ItemToggleValue,
  MatchingItemC,
  MatchingItems,
  QueryResponse,
  SearchableProfile,
} from '@becoming-german/model';
import { BehaviorSubject } from 'rxjs';
import { ChildhoodProfileRequestTable } from './childhood-profile-table';
import { BookItem } from './book-item';
import { SongItem } from './song-item';
import { AudioBookItem } from './audio-book-item';
import { PartyItem } from './party-item';
import * as t from 'io-ts';
import { dbConfig } from './config';
import { PathReporter } from 'io-ts/PathReporter';

const processPerson = (row: unknown): Either<number, Childhood> => {

  return pipe(
    row['json_mapping'],
    PersonTable.decode,
    E.map(v => {
      console.log('we made it this far', v);
      return v;
    }),
    E.chain(ChildhoodC.decode),
    E.mapLeft(() => row['id'])
  )

};

const processNormalizedPerson = (row: { id: number; jsonData: unknown }): Either<number, SearchableProfile> => {
  const validationResult = ChildhoodC.decode(row.jsonData);
  if (isLeft(validationResult)) {
    console.log('failed decoding', PathReporter.report(validationResult));
  }

  return pipe(
    validationResult,
    mapLeft(() => row.id),
  );
};
// const mQuery =
//   (connection: Pool) =>
//   <T>(sql: string): Promise<T> =>
//     new Promise((res, rej) => connection.query(sql, (e, r) => (e ? rej(e) : res(r))));
export type UpdateResult = {
  id: number;
  error?: Error;
};

const itemBitSum = (pt: Childhood) => items.reduce((r, i: Item) => (pt.profile[i] != null ? r + ItemToggleValue[i] : r), 0);

const updateJsonWithPool =
  (pool: Pool) =>
  (person: Childhood): TE.TaskEither<UpdateResult, UpdateResult> => {
    return pipe(
      TE.tryCatch(
        async (): Promise<UpdateResult> => {
          const items_de = itemBitSum(person);
          const sql = `update tbl_german_person SET jsonData = ?, items_de = ?, migrated = 1 WHERE id = ?`;

          const conn = await pool.getConnection();
          await conn.execute(sql, [JSON.stringify(person), items_de, person.id]);
          conn.release();
          return { id: person.legacyId };
        },
        (error: Error): UpdateResult => ({ error, id: person.legacyId}),
      ),
    );
  };

export class PersonService {
  private pool = createPool(dbConfig);
  private totalRows = new BehaviorSubject(0);

  async addQuarantined(ids: number[]) {
    const conn = await this.pool.getConnection();
    const sql = conn.format(`UPDATE tbl_german_person SET isQuarantined=1 WHERE id in (?)`, [ids]);
    console.log(sql);
    const [upResult] = await conn.execute(sql);

    console.warn(upResult['changedRows'], 'entries in german_person quarantined', ids);
  }

  async getNormalizedData(offset: number, limit: number): Promise<QueryResponse<SearchableProfile>> {
    const conn = await this.pool.getConnection();
    try {
      if (this.totalRows.getValue() === 0) this.totalRows.next((await conn.execute(countPersonSql))[0][0]['total']);
      const sql = getNormalizePersonSql(offset, limit);
      console.log(sql);
      const res = pipe(await conn.execute(sql), (r) => r[0] as unknown[], A.partitionMap(processNormalizedPerson));
      conn.release();
      return {
        status: 'ok',
        total: this.totalRows.getValue(),
        errors: res.left.length,
        offset,
        endId: res.right.length > 0 ? res.right[res.right.length - 1].id : offset,
        result: res.right,
      };
    } catch (e: unknown) {
      console.error(e);
      return { total: this.totalRows.getValue(), errors: 0, offset, endId: offset, result: [], status: 'error' };
    }
  }

  async getData(offset: number, limit: number): Promise<QueryResponse<Childhood>> {
    const conn = await this.pool.getConnection();
    try {
      if (this.totalRows.getValue() === 0) this.totalRows.next((await conn.execute(countPersonSql))[0][0]['total']);

      const sql = getPersonSql(offset, limit);
      const res = pipe(
        await conn.execute(sql),
        (r) => r[0] as unknown[],

        A.partitionMap(processPerson),
      );

      if (res.left.length > 0) await this.addQuarantined(res.left);
      conn.release();
      return {
        status: 'ok',
        total: this.totalRows.getValue(),
        errors: res.left.length,
        offset,
        endId: res.right.length > 0 ? res.right[res.right.length - 1].id : offset,
        result: res.right,
      };
    } catch (e: unknown) {
      console.error(e);
      return { total: this.totalRows.getValue(), errors: 0, offset, endId: offset, result: [], status: 'error' };
    }
  }

  normalise(fromId: number, limit = 500) {
    const update = updateJsonWithPool(this.pool);

    const getData = (id: number) =>
      TE.tryCatch(
        () => this.getData(id, limit),
        (error: Error): UpdateResult => ({ error, id }),
      );
    const queryToUpdate = flow(
      (r: QueryResponse<Childhood>) => r.result,
      A.map(update),
      A.map(TE.fold(TE.right, TE.right)),
      A.sequence(TE.ApplicativePar),
    );
    const getRes = async function* (currentId: number = fromId): AsyncGenerator<UpdateResult[]> {
      const result = await pipe(getData(currentId), TE.chain(queryToUpdate))();

      if (E.isLeft(result)) {
        console.log('result is left', result.left);
        yield [];
      } else {
        const lastId = last(result.right); // Assuming the last number in the array is the
        if (O.isNone(lastId)) {
          console.log('last id is null');
          yield [];
          return;
        }
        if (lastId.value.error) {
          console.log('we have an error on', lastId.value.id);
          yield [];
          return;
        } else {
          yield result.right;
          yield* getRes(lastId.value.id);
        }
      }
      return;
    };
    return getRes;
  }

  private async _findMatchingItem(profile: ChildhoodProfileRequestTable) {
    const exe = async (sql: string): Promise<MatchRow[]> => {
      const conn = await this.pool.getConnection();
      const [rows] = await conn.execute(sql);
      conn.release();
      return rows as MatchRow[];
    };
    const results = (await Promise.all(getSearch(profile).map(exe))).flat();
    return processMatchingItem(results);
  }

  findMatchingItem(profile: ChildhoodProfileRequestTable): TE.TaskEither<Error, MatchingItems> {
    return pipe(
      TE.tryCatch(
        () => this._findMatchingItem(profile),
        (e) => (e instanceof Error ? e : new Error(`${e}`)),
      ),
      TE.chain(TE.fromEither),
    );
  }
}

export const MatchingItemsDBC = t.type({
  book: MatchingItemC(BookItem),
  grandparents: MatchingItemC(Grandparents),
  holidays: MatchingItemC(Holiday),
  memory: MatchingItemC(t.string),
  party: MatchingItemC(PartyItem),
  song: MatchingItemC(SongItem),
  audioBook: MatchingItemC(AudioBookItem),
});

export type MatchRow = {
  jsonItem: Partial<MatchingItems>;
};

const processMatchingItem = (rows: MatchRow[]): Either<Error, MatchingItems> => {
  console.log(JSON.stringify(rows, undefined, 2));
  return pipe(
    rows,
    A.map((r) => r.jsonItem),
    A.reduce({}, (r, v) => ({ ...r, ...v })),
    MatchingItemsDBC.decode,
    E.mapLeft(formatValidationErrors),
    E.mapLeft((errors) => new Error(errors.join('\n'))),
  );
};
