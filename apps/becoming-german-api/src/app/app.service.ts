import { Injectable } from '@nestjs/common';
import { createPool } from 'mysql';
import { dbConfig } from '../datasource/config';
import { dbRowToPerson } from "../datasource/db-row-to-person";

@Injectable()
export class AppService {
  private connection = createPool(dbConfig);

  async getData(): Promise<unknown[]> {
    try {
      const rows: unknown[] = await new Promise((res, rej) => {
        this.connection.query(
          'SELECT * from tbl_german_person LIMIT 10',
          (e, r) => (e ? rej(e) : res(r)),
        );
      });
      return rows.map(dbRowToPerson);
    } catch (e: unknown) {
      return [];
    }
  }
}
