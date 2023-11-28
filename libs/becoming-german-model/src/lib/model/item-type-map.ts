import { NullableTranslatable, NullableTranslatableC } from './nullableTranslatable';
import * as t from 'io-ts';
import { Item, itemPropsRaw } from './item';
import { pipe } from 'fp-ts/function';
import { toEntries } from 'fp-ts/Record';
import * as A from 'fp-ts/Array';

export const itemProps = pipe(
  itemPropsRaw,
  toEntries,
  A.reduce({}, (r, [k, v]) => ({ ...r, [k]: NullableTranslatableC(v) })),
) as { [K in Item]: t.Type<NullableTranslatable<(typeof itemPropsRaw)[K]>> };


const ItemsC = t.type(itemProps);
export const items: Item[] = Object.keys(itemProps) as Item[];
export type ChildhoodItems = t.TypeOf<typeof ItemsC>;
export type HasChildhoodItems = {
  [K in Item]: boolean;
};

export const getItemStatus: <T extends ChildhoodItems>(items: T) => HasChildhoodItems = (i) => ({
  book: i.book != null,
  grandparents: i.grandparents != null,
  holidays: i.holidays != null,
  memory: i.memory != null,
  party: i.party != null,
  song: i.song != null,
  speaking_book: i.speaking_book != null,
});
