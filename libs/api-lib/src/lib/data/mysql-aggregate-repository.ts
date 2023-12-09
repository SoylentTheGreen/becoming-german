import { createPool, Pool } from 'mysql2/promise';
import { AggregateEvent } from '@becoming-german/model';
import { toEntries } from 'fp-ts/Record';
import * as TE from 'fp-ts/TaskEither';
import { dbConfig } from '../config';

export const getRepository = (config = dbConfig) => new MysqlAggregateRepository(createPool(config));
const TryCatch = <T>(cb: () => Promise<T>): TE.TaskEither<Error, T> =>
  TE.tryCatch(cb, (error) => (error instanceof Error ? error : new Error(`Unexpected error: ${error}`)));

class MysqlAggregateRepository {
  constructor(private pool: Pool) {}

  private async q(sql: string, ...args: unknown[]) {
    const conn = await this.pool.getConnection();
    const res = await conn.execute(sql, args);
    conn.release();
    return res;
  }

  //
  // private async _aggregateExists(id: string): Promise<boolean> {
  //   const res = await this.q(`SELECT EXISTS( SELECT 1 FROM event_store WHERE aggregateId = ? ) AS 'exists'; `, id);
  //   return res[0]['exists'] === 1;
  // }
  //
  // aggregateExists = (id: string) => TryCatch(() => this._aggregateExists(id));
  //
  private async _findByAggregateId(id: string): Promise<AggregateEvent[]> {
    const result = await this.q(
      `SELECT json_object(
      'id', id, 
      'type', type, 
      'aggregateId', aggregateId, 
      'aggregateType', aggregateType, 
      'aggregateVersion', aggregateVersion, 
      'timestamp', timestamp, 
      'payload', payload) as event from event_store WHERE aggregateId = ? ORDER BY aggregateVersion`,
      id,
    );

    if (result[0] && Array.isArray(result[0]) && result[0].length)
      return result[0].map((row) => ({...row['event'], payload: JSON.parse(row['event']['payload'])}));
    throw new Error('no results found');
  }

  //
  findByAggregateId = (id: string) => TryCatch(() => this._findByAggregateId(id));
  //
  // private _findWithSnapshot<T>(
  //   id: string,
  //   type: IOSType<AggregateSnapshotWithEvents<T>, unknown>,
  // ): TE.TaskEither<Error, AggregateSnapshotWithEvents<T>> {
  //   const sql = `SELECT JSON_OBJECT(
  //              'snapshot', COALESCE(snap.data, null),
  //              'events', COALESCE(es_events.events, JSON_ARRAY()))
  //          AS snapshot
  //     FROM (SELECT aggregateId,
  //            aggregateType,
  //            JSON_ARRAYAGG(
  //                    JSON_OBJECT(
  //                            'id', event_store.id,
  //                            'type', event_store.type,
  //                            'aggregateId', event_store.aggregateId,
  //                            'aggregateType', event_store.aggregateType,
  //                            'aggregateVersion', event_store.aggregateVersion,
  //                            'timestamp', event_store.timestamp,
  //                            'payload', event_store.payload
  //                        )
  //                ) AS events
  //     FROM event_store
  //     WHERE aggregateId = ?
  //       AND aggregateType = ?
  //     GROUP BY event_store.aggregateId, event_store.aggregateType) AS es_events
  //        LEFT JOIN event_store_snapshot snap
  //                  ON es_events.aggregateId = snap.aggregateId
  //                      AND es_events.aggregateType = snap.aggregateType;`;
  //   return pipe(
  //     TryCatch(() => this.q(sql, id, type)),
  //     TE.chain(([row]) => (row ? TE.right(row) : TE.left(new Error('no result found')))),
  //     TE.chain((row) =>
  //       pipe(
  //         row,
  //         type.decode,
  //         E.mapLeft(() => new Error(`could not decode ${row}`)),
  //         TE.fromEither,
  //       ),
  //     ),
  //   );
  // }
  //
  // findWithSnapshot<T>(
  //   id: string,
  //   type: IOSType<AggregateSnapshotWithEvents<T>, unknown>,
  // ): TE.TaskEither<Error, AggregateSnapshotWithEvents<T>> {
  //   return this._findWithSnapshot(id, type);
  // }
  //
  // private async _nextAggregateVersion(id: string, type: string): Promise<number> {
  //   const rows = await this.q(
  //     `
  //       SELECT
  //           COALESCE(MAX(aggregateVersion), 0) AS maxVersion
  //       FROM
  //           event_store
  //       WHERE
  //           aggregateId = ? AND aggregateType = ?;
  //   `,
  //     id,
  //     type,
  //   );
  //   return rows[0]['maxVersion'];
  // }
  //
  // nextAggregateVersion = (id: string, type: string): TE.TaskEither<Error, number> =>
  //   TryCatch(() => this._nextAggregateVersion(id, type));
  //
  private async _save(event: AggregateEvent) {
    const asEntries = toEntries({ ...event, payload: JSON.stringify(event.payload) });

    const res = await this.q(
      `
    INSERT INTO event_store ( ${asEntries.map(([k]) => k).join(',')} )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    aggregateVersion = VALUES(aggregateVersion)`,
      ...asEntries.map(([, v]) => v),
    );
    if (res[0]['affectedRows'] !== 1) throw new Error(`DB returned error: ${JSON.stringify(res[0])}`);
    return event;
  }

  save = (event: AggregateEvent) => TryCatch(() => this._save(event));
}
