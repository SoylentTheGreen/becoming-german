import { createPool, Pool } from 'mysql';

import { pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import { isLeft, isRight } from 'fp-ts/Either';
import { fromEither } from 'fp-ts/Option';
import { Validation } from 'io-ts';
import { dbConfig } from './config';
import { countPersonSql, getPersonSql, getSearch, PersonTable } from './person-table';
import { Grandparents, Holiday, MatchingItemC, MatchingItems, Memory, QueryResponse } from '@becoming-german/model';
import { BehaviorSubject } from 'rxjs';
import { ChildhoodProfileTable } from './childhood-profile-table';
import { BookItem } from './book-item';
import { SongItem } from './song-item';
import { AudioBookItem } from './audio-book-item';
import { PartyItem } from './party-item';
import * as t from 'io-ts';

const processItem = (row: unknown): Validation<PersonTable> => {
  const item = JSON.parse(row['json_mapping']);
  const validationResult = PersonTable.decode(item);

  if (isLeft(validationResult)) {
    // console.log('failed parsing', item);
    console.error(
      `Validation failed! on ${item['id']}`,
      // JSON.stringify(PathReporter.report(validationResult), undefined, 4),
      // JSON.stringify(item, undefined, 4),
    );
  }

  return validationResult;
};

const mQuery =
  (connection: Pool) =>
  <T>(sql: string): Promise<T> =>
    new Promise((res, rej) => connection.query(sql, (e, r) => (e ? rej(e) : res(r))));

export class PersonService {
  private connection = createPool(dbConfig);
  private totalRows = new BehaviorSubject(0);

  async getData(offset: number, limit: number): Promise<QueryResponse<PersonTable>> {
    const q = mQuery(this.connection);
    try {
      if (this.totalRows.getValue() === 0)
        this.totalRows.next(
          (<
            [
              {
                total: number;
              },
            ]
          >await q(countPersonSql))[0].total,
        );

      return {
        status: 'ok',
        total: this.totalRows.getValue(),
        offset,
        result: pipe(await q(getPersonSql(offset, limit)), A.map(processItem), A.filterMap(fromEither)),
      };
    } catch (e: unknown) {
      console.error(e);
      return { total: this.totalRows.getValue(), offset, result: [], status: 'error' };
    }
  }

  async findMatchingItem(profile: ChildhoodProfileTable) {
    const rows: {
      jsonItem: string;
    }[] = await mQuery(this.connection)(getSearch(profile));
    return processMatchingItem(rows);
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

type MatchRow = {
  jsonItem: string;
};

const processMatchingItem = (rows: MatchRow[]) => {
  const dbResult = pipe(
    rows,
    A.map(({ jsonItem }) => jsonItem),
    A.map(JSON.parse),
    A.reduce({} as Partial<MatchingItems>, (r, v) => ({ ...r, ...v })),
  );
    const validationResult = MatchingItemsDBC.decode(dbResult);
  if(isRight(validationResult)) return validationResult.right;


  if (isLeft(validationResult)) {
    // console.log('failed parsing', item);
    console.error(
      `Validation failed! on ${dbResult}`,
      // JSON.stringify(PathReporter.report(validationResult), undefined, 4),
      // JSON.stringify(item, undefined, 4),
    );
  }
  return null;
};
