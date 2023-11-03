import { Grandparents } from './grandparents';
import { Holiday } from './holiday';
import { Memory } from './memory';
import { Book } from './book';
import { Song } from './song';
import { AudioBook } from './audio-book';
import { Party } from './party';
import { NullableTranslatableC } from './nullableTranslatable';
import * as t from 'io-ts';
import { Item } from './item';

export const itemProps = {
  book: NullableTranslatableC(Book),
  grandparents: NullableTranslatableC(Grandparents),
  holidays: NullableTranslatableC(Holiday),
  memory: NullableTranslatableC(Memory),
  party: NullableTranslatableC(Party),
  song: NullableTranslatableC(Song),
  speaking_book: NullableTranslatableC(AudioBook),
};


const ItemsC = t.type(itemProps);
export type ChildhoodItems = t.TypeOf<typeof ItemsC>
export type HasChildhoodItems = {
  [K in Item]: boolean;
};

export const getItemStatus: <T extends ChildhoodItems>(items: T) => HasChildhoodItems = (i) => ({
  book         : i.book != null,
  grandparents : i.grandparents != null,
  holidays     : i.holidays != null,
  memory       : i.memory != null,
  party        : i.party != null,
  song         : i.song != null,
  speaking_book: i.speaking_book != null,
});


