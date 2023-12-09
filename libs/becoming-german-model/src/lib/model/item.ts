import { literalStringArrayTyping } from '@becoming-german/tools';
import { Book } from './book';
import { Grandparents } from './grandparents';
import { Holiday } from './holiday';
import { Party } from './party';
import { Song } from './song';
import { AudioBook } from './audio-book';
import * as t from 'io-ts';
import { keys } from 'fp-ts/lib/ReadonlyRecord';

export const ItemToggleValue: Record<Item, number> = {
  book: 1,
  grandparents: 2,
  holidays: 4,
  memory: 8,
  party: 16,
  song: 32,
  audioBook: 64,
};
const nullable =  <T extends t.Mixed>(val: T) => t.union([t.null, val]);
export const searchableItems = {
  memory: nullable(t.string),
  book: nullable(Book),
  grandparents: nullable(Grandparents),
  holidays: nullable(Holiday),
  party: nullable(Party),
  song: nullable(Song),
  audioBook: nullable(AudioBook)
}

export const ItemC = t.keyof(searchableItems);
export type Item = t.TypeOf<typeof ItemC>;
export const items = keys(ItemToggleValue);
export const itemsType = literalStringArrayTyping('Item', Object.keys(ItemToggleValue));



