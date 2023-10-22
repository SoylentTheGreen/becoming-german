import { Injectable } from '@nestjs/common';
import { createPool } from 'mysql';
import { dbConfig } from '../datasource/config';
import { PersonTable } from '../datasource/db-row-to-person';
import { pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import { isLeft } from 'fp-ts/Either';
import { fromEither } from 'fp-ts/es6/Option';
import { Validation } from "io-ts";

const processItem = (item: unknown): Validation<PersonTable> => {
  const validationResult = PersonTable.decode(item);

  if (isLeft(validationResult)) {
    console.error('Validation failed!', validationResult.left);
  }

  return validationResult;
};
@Injectable()
export class AppService {
  private connection = createPool(dbConfig);

  async getData(): Promise<unknown[]> {
    try {
      const rows: unknown[] = await new Promise((res, rej) => {
        this.connection.query(
          "SELECT * from tbl_german_person LIMIT 10",
          (e, r) => (e ? rej(e) : res(r))
        );
      });
      return pipe(rows, A.map(processItem), A.filterMap(fromEither));
    } catch (e: unknown) {
      return [];
    }
  }
}


