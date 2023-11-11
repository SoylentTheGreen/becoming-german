import { createPool, Pool } from 'mysql2/promise';
import { flow, pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import { last } from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { Either, isLeft, isRight, mapLeft } from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';

import { countPersonSql, getPersonSql, getSearch, PersonTable } from './person-table';
import {
  Grandparents,
  Holiday,
  Item,
  items,
  ItemToggleValue,
  MatchingItemC,
  MatchingItems,
  Memory,
  QueryResponse,
} from '@becoming-german/model';
import { BehaviorSubject } from 'rxjs';
import { ChildhoodProfileTable } from './childhood-profile-table';
import { BookItem } from './book-item';
import { SongItem } from './song-item';
import { AudioBookItem } from './audio-book-item';
import { PartyItem } from './party-item';
import * as t from 'io-ts';
import { dbConfig } from './config';

// const processEntry = (row: unknown): Either<number, Entry> => {
//   const item = row['jsonItem'];
//   const validationResult = EntryC.decode(item);
//
//   if (isLeft(validationResult)) {
//     const failedPropertyNames = validationResult.left.map((error) => error.context[error.context.length - 1].key);
//
//     console.log('failed parsing', failedPropertyNames);
//   }
//   return pipe(
//     validationResult,
//     mapLeft(() => row['id']),
//   );
// };

const processPerson = (row: unknown): Either<number, PersonTable> => {
  const item = row['json_mapping'];
  const validationResult = PersonTable.decode(item);

  if (isLeft(validationResult)) {
    // const failedPropertyNames = validationResult.left.map((error) => error.context[error.context.length - 1].key);
    console.log('failed parsing', item['id']);
  }
  return pipe(
    validationResult,
    mapLeft(() => item['id']),
  );
};
// const mQuery =
//   (connection: Pool) =>
//   <T>(sql: string): Promise<T> =>
//     new Promise((res, rej) => connection.query(sql, (e, r) => (e ? rej(e) : res(r))));
export type UpdateResult = { id: number; error?: Error };

const itemBitSum = (pt: PersonTable) => items.reduce((r, i: Item) => (pt[i] != null ? r + ItemToggleValue[i] : r), 0);

const updateJsonWithPool =
  (pool: Pool) =>
  (person: PersonTable): TE.TaskEither<UpdateResult, UpdateResult> => {
    return pipe(
      TE.tryCatch(
        async (): Promise<UpdateResult> => {
          const items_de = itemBitSum(person);
          const sql = `update tbl_german_person SET jsonData = ?, items_de = ?, migrated = 1 WHERE id = ?`;

          const conn = await pool.getConnection();
          await conn.execute(sql, [JSON.stringify(person), items_de, person.id]);
          conn.release();
          return { id: person.id };
        },
        (error: Error): UpdateResult => ({ error, id: person.id }),
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

  async getData(offset: number, limit: number): Promise<QueryResponse<PersonTable>> {
    const conn = await this.pool.getConnection();
    try {
      if (this.totalRows.getValue() === 0) this.totalRows.next((await conn.execute(countPersonSql))[0][0]['total']);

      const res = pipe(
        await conn.execute(getPersonSql(offset, limit)),
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
      (r: QueryResponse<PersonTable>) => r.result,
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

  async findMatchingItem(profile: ChildhoodProfileTable) {
    const exe = async (sql: string): Promise<MatchRow[]> => {
      const conn = await this.pool.getConnection();
      const [rows] = await conn.execute(sql);
      conn.release();
      return rows as MatchRow[];
    };

    const results = (await Promise.all(getSearch(profile).map(exe))).flat();
    console.log(results);

    return processMatchingItem(results);
  }
}

export const MatchingItemsDBC = t.type({
  book: MatchingItemC(BookItem),
  grandparents: MatchingItemC(Grandparents),
  holidays: MatchingItemC(Holiday),
  memory: MatchingItemC(Memory),
  party: MatchingItemC(PartyItem),
  song: MatchingItemC(SongItem),
  speaking_book: MatchingItemC(AudioBookItem),
});

export type MatchRow = { jsonItem: Partial<MatchingItems> };

const processMatchingItem = (rows: MatchRow[]) => {
  const dbResult = pipe(
    rows,
    A.map((r) => r.jsonItem),
    A.reduce({} as Partial<MatchingItems>, (r, v) => ({ ...r, ...v })),
  );
  const validationResult = MatchingItemsDBC.decode(dbResult);
  if (isRight(validationResult)) return validationResult.right;

  if (isLeft(validationResult)) {
    // console.log('failed parsing', item);
    console.error(
      `Validation failed! on ${JSON.stringify(dbResult)}`,
      validationResult.left.map((error) => error.context[error.context.length - 1].key),
      // JSON.stringify(PathReporter.report(validationResult), undefined, 4),
      // JSON.stringify(item, undefined, 4),
    );
  }
  return null;
};
