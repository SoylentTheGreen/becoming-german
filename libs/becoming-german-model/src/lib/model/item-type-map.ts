import { NullableTranslatableC } from './nullableTranslatable';
import * as t from 'io-ts';
import { Item, itemPropsRaw } from './item';

export const itemProps = {
  book: NullableTranslatableC(itemPropsRaw.book),
  grandparents: NullableTranslatableC(itemPropsRaw.grandparents),
  holidays: NullableTranslatableC(itemPropsRaw.holidays),
  memory: NullableTranslatableC(itemPropsRaw.memory),
  party: NullableTranslatableC(itemPropsRaw.party),
  song: NullableTranslatableC(itemPropsRaw.song),
  speaking_book: NullableTranslatableC(itemPropsRaw.speaking_book),
};
// pipe(
//   itemPropsRaw,
//   toEntries,
//   A.reduce({}, (r, [k, v]) => ({ ...r, [k]: NullableTranslatableC(v) })),
// ) as { [K in Item]: t.Type<NullableTranslatable<(typeof itemPropsRaw)[K]>> };

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
