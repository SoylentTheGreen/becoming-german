import { Item } from './item';
import { ChildhoodProfile } from './donated-profile';


// pipe(
//   itemPropsRaw,
//   toEntries,
//   A.reduce({}, (r, [k, v]) => ({ ...r, [k]: NullableTranslatableC(v) })),
// ) as { [K in Item]: t.Type<NullableTranslatable<(typeof itemPropsRaw)[K]>> };



export type HasChildhoodItems = {
  [K in Item]: boolean;
};

export const getItemStatus: <T extends ChildhoodProfile>(items: T) => HasChildhoodItems = (i) => ({
  book: i.book != null,
  grandparents: i.grandparents != null,
  holidays: i.holidays != null,
  memory: i.memory != null,
  party: i.party != null,
  song: i.song != null,
  audioBook: i.audioBook != null,
});
