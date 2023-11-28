import { literalStringArrayTyping } from '@becoming-german/tools';
import { Book } from './book';
import { Grandparents } from './grandparents';
import { Holiday } from './holiday';
import { Memory } from './memory';
import { Party } from './party';
import { Song } from './song';
import { AudioBook } from './audio-book';
import * as t from 'io-ts';

export const itemPropsRaw = {
  book: Book,
  grandparents: Grandparents,
  holidays: Holiday,
  memory: Memory,
  party: Party,
  song: Song,
  speaking_book: AudioBook,
};
export const ItemC = t.keyof(itemPropsRaw);
export type Item = t.TypeOf<typeof ItemC>;
export const itemsType = literalStringArrayTyping('Item', Object.keys(itemPropsRaw));

export const ItemToggleValue: Record<Item, number> = {
  book: 1,
  grandparents: 2,
  holidays: 4,
  memory: 8,
  party: 16,
  song: 32,
  speaking_book: 64,
};

