import * as t from 'io-ts';

export type AggregateEvent<T = unknown> = {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  aggregateVersion: number;
  payload: T;
  timestamp: number;
};

export const EventTypeC = t.type({ aggregateType: t.string, type: t.string });

export const eventTypeBuilder = <A extends t.Mixed>(aggregate: A) => <T, O = T>(
    type: string,
    payload: t.Type<T, O>,
  ): t.Type<AggregateEvent<T>, AggregateEvent<O>> =>
    t.type({
      id: t.string,
      type: t.literal(type),
      aggregateId: t.string,
      aggregateType: t.literal(aggregate.name),
      aggregateVersion: t.refinement(t.number, (n) => Number.isInteger(n) && n > 0, 'PositiveInteger'),
      payload,
      timestamp: t.number,
    });


