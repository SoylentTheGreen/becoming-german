import { createPool, Pool } from 'mysql';

import { pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import { isLeft } from 'fp-ts/Either';
import { fromEither } from 'fp-ts/Option';
import { Validation } from 'io-ts';
import { dbConfig } from './config';
import { PathReporter } from 'io-ts/PathReporter';
import { countPersonSql, getPersonSql, getSearch, PersonTable } from './person-table';
import { ChildhoodProfile, QueryResponse } from '@becoming-german/model';
import { BehaviorSubject } from 'rxjs';
import { ChildhoodProfileTable } from './childhood-profile-table';

const processItem = (row: unknown): Validation<PersonTable> => {
  const item = JSON.parse(row['json_mapping']);
  const validationResult = PersonTable.decode(item);

  if (isLeft(validationResult)) {
    console.error(
      `Validation failed! on ${item['id']}`,
      JSON.stringify(PathReporter.report(validationResult), undefined, 4),
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
        this.totalRows.next((<[{ total: number }]>await q(countPersonSql))[0].total);


      return {
        status: 'ok',
        total: this.totalRows.getValue(),
        offset,
        result: pipe(await q(getPersonSql(offset, limit)), A.map(processItem), A.filterMap(fromEither)),
      };
    } catch (e: unknown) {
      return {total: this.totalRows.getValue(), offset, result: [], status: 'error'};
    }
  }

  async findMatchingItem(profile: ChildhoodProfileTable) {
    return mQuery(this.connection)(getSearch(profile));
  }
}
