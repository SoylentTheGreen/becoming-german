import { Type as IOSType } from 'io-ts';
import { Pool } from 'mysql2/promise';
import { AggregateEvent, AggregateRepository, AggregateSnapshotWithEvents, EventTypeC } from '@becoming-german/model';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { toEntries } from 'fp-ts/Record';

const TryCatch = <T>(cb: () => Promise<T>): TE.TaskEither<Error, T> =>
  TE.tryCatch(cb, (error) => (error instanceof Error ? error : new Error(`Unexpected error: ${error}`)));

export class MysqlAggregateRepository implements AggregateRepository {
  constructor(private pool: Pool) {}

  private async q(q: string, ...args: unknown[]) {
    const conn = await this.pool.getConnection();
    const res = await conn.execute(q, args);
    conn.release();
    return res;
  }

  private async _aggregateExists(id: string): Promise<boolean> {
    const res = await this.q(`SELECT EXISTS( SELECT 1 FROM event_store WHERE aggregateId = ? ) AS 'exists'; `, id);
    return res[0]['exists'] === 1;
  }

  aggregateExists = (id: string) => TryCatch(() => this._aggregateExists(id));

  private async _findByAggregateId(id: string): Promise<AggregateEvent[]> {
    return pipe(
      await this.q('SELECT * from event_store WHERE aggregateId = ? ORDER BY aggregateVersion', id),
      A.filterMap(flow(EventTypeC.decode, O.fromEither)),
    );
  }

  findByAggregateId = (id: string) => TryCatch(() => this._findByAggregateId(id));

  private _findWithSnapshot<T>(
    id: string,
    type: IOSType<AggregateSnapshotWithEvents<T>, unknown>,
  ): TE.TaskEither<Error, AggregateSnapshotWithEvents<T>> {
    const sql = `SELECT JSON_OBJECT(
               'snapshot', COALESCE(snap.data, null),
               'events', COALESCE(es_events.events, JSON_ARRAY()))
           AS snapshot
      FROM (SELECT aggregateId,
             aggregateType,
             JSON_ARRAYAGG(
                     JSON_OBJECT(
                             'id', event_store.id,
                             'type', event_store.type,
                             'aggregateId', event_store.aggregateId,
                             'aggregateType', event_store.aggregateType,
                             'aggregateVersion', event_store.aggregateVersion,
                             'timestamp', event_store.timestamp,
                             'payload', event_store.payload
                         )
                 ) AS events
      FROM event_store
      WHERE aggregateId = ?
        AND aggregateType = ?
      GROUP BY event_store.aggregateId, event_store.aggregateType) AS es_events
         LEFT JOIN event_store_snapshot snap
                   ON es_events.aggregateId = snap.aggregateId
                       AND es_events.aggregateType = snap.aggregateType;`;
    return pipe(
      TryCatch(() => this.q(sql, id, type)),
      TE.chain(([row]) => (row ? TE.right(row) : TE.left(new Error('no result found')))),
      TE.chain((row) =>
        pipe(
          row,
          type.decode,
          E.mapLeft(() => new Error(`could not decode ${row}`)),
          TE.fromEither,
        ),
      ),
    );
  }

  findWithSnapshot<T>(
    id: string,
    type: IOSType<AggregateSnapshotWithEvents<T>, unknown>,
  ): TE.TaskEither<Error, AggregateSnapshotWithEvents<T>> {
    return this._findWithSnapshot(id, type);
  }

  private async _nextAggregateVersion(id: string, type: string): Promise<number> {
    const rows = await this.q(
      `
        SELECT 
            COALESCE(MAX(aggregateVersion), 0) AS maxVersion 
        FROM 
            event_store 
        WHERE 
            aggregateId = ? AND aggregateType = ?;
    `,
      id,
      type,
    );
    return rows[0]['maxVersion'];
  }

  nextAggregateVersion = (id: string, type: string): TE.TaskEither<Error, number> =>
    TryCatch(() => this._nextAggregateVersion(id, type));

  private async _save<T>(event: AggregateEvent<T>) {
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

  save = <E>(event: AggregateEvent<E>) => TryCatch(() => this._save(event));
}
