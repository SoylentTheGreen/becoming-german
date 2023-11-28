import * as t from 'io-ts';
import { DonatedProfile } from './person';
import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import { ChildhoodProfile } from './childhood-profile';
import { pipe } from 'fp-ts/function';
import { Book } from './book';
import { Holiday } from './holiday';
import { ChildhoodItems } from './item-type-map';
import { Item, ItemC, itemPropsRaw } from './item';
import { toEntries } from 'fp-ts/Record';

type AggregateEvent<A extends string = string, E extends string = string, T = t.Any> = {
  id: string;
  type: E;
  aggregateId: string;
  aggregateType: A;
  aggregateVersion: number;
  payload: T;
  timestamp: number;
};

export const EventTypeC = t.type({ aggregateType: t.string, type: t.string });

export const eventTypeBuilder =
  <A extends string>(aggregate: A) =>
  <E extends string, T, O = T>(
    type: E,
    payload: t.Type<T, O>,
  ): t.Type<AggregateEvent<A, E, T>, AggregateEvent<A, E, O>> =>
    t.type({
      id: t.string,
      type: t.literal(type),
      aggregateId: t.string,
      aggregateType: t.literal(aggregate),
      aggregateVersion: t.refinement(t.number, (n) => Number.isInteger(n) && n > 0, 'PositiveInteger'),
      payload,
      timestamp: t.number,
    });

export type AggregateConfig<I, A extends string, IO, E extends string, ET, EO> = {
  aggregate: A;
  aggregateBuilder: t.Type<I, IO>;
  key: E;
  eventCodec: t.Type<AggregateEvent<A, E, ET>, AggregateEvent<A, E, EO>>;
  reducer: (s: Partial<I>, e: AggregateEvent<A, E, ET>) => Partial<I>;
};

const buildEventReducer = <I, A extends string, IO = I>(aggregate: A, aggregateType: t.Type<I, IO>) => {
  const aggBuilder = eventTypeBuilder(aggregate);

  return <E extends string, T, O>(
    key: E,
    p: t.Type<T, O>,
    reducer: (s: Partial<I>, e: AggregateEvent<A, E, T>) => Partial<I>,
  ): AggregateConfig<I, A, IO, E, T, O> => {
    const eventCodec: t.Type<AggregateEvent<A, E, T>, AggregateEvent<A, E, O>> = aggBuilder(key, p);
    return {
      aggregateBuilder: aggregateType,
      aggregate,
      key,
      eventCodec,
      reducer,
    };
  };
};

const dBuilder = buildEventReducer('DonatedProfile', DonatedProfile);
export const donatedEvents = [
  dBuilder('UpdateProfile', t.partial(ChildhoodProfile.props), (s, e) => ({ ...s, ...e.payload })),
  dBuilder('AddProfile', ChildhoodProfile, (s, e) => ({ ...s, ...e.payload })),
  dBuilder('AddBook', Book, (s, e) => ({ ...s, book: { de: e.payload, en: null } })),
];
export const findDonatedProfileAggregateConfig = (i: unknown): O.Option<(typeof donatedEvents)[number]> =>
  pipe(
    EventTypeC.decode(i),
    O.fromEither,
    O.chain((e) =>
      pipe(
        donatedEvents,
        A.findFirst((i) => i.aggregate === e.aggregateType && i.key === e.type),
      ),
    ),
  );

type ItemUpdate = {
  key: Item;
  value: ChildhoodItems[Item];
};

const theTypes: [t.Mixed, t.Mixed, ...t.Mixed[]] = [
  itemPropsRaw.book,
  itemPropsRaw.grandparents,
  ...pipe(
    itemPropsRaw,
    toEntries,
    A.filter(([k]) => !['book', 'grandparents'].includes(k)),
    A.map(([, v]) => v),
  ),
];
const ItemUpdateCodec = t.type({ key: ItemC, value: t.union(theTypes) });
// const ItemUpdateC = new t.Type<ItemUpdate, ItemUpdate>(
//   'ItemUpdate',
//   (i): i is ItemUpdate => ItemUpdateCodec.is(i) && itemPropsRaw[i.key as keyof typeof itemPropsRaw].is(i.value),
//   (u, c) => {
//
//     pipe(
//       ItemUpdateCodec.validate(u, c),
//       itemPropsRaw[up.key as keyof typeof itemPropsRaw].validate(up.value, c)
//     );
//
//
//     return codecForT.validate(u.p, c).map((p) => ({ t: u.t, p }));
//   },
//   (a) => a,
// );

export class DonatedProfileAggregateBuilder {
  private eventReducerBuilder = buildEventReducer('DonatedProfile', DonatedProfile);
  private updateProfile = dBuilder('UpdateProfile', t.partial(ChildhoodProfile.props), (s, e) => ({
    ...s,
    ...e.payload,
  }));
  private addProfile = dBuilder('AddProfile', ChildhoodProfile, (s, e) => ({ ...s, ...e.payload }));
  private addItem = dBuilder('AddItem', t.partial(itemPropsRaw), (s, e) => ({ ...s }));
  private addHoliday = dBuilder('AddHoliday', Holiday, (s, e) => ({ ...s, holidays: { de: e.payload, en: null } }));

  constructor() {}
}
