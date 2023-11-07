import * as t from 'io-ts';
import { Translatable, TranslatableC } from './nullableTranslatable';
import { Book } from './book';
import { Grandparents } from './grandparents';
import { Holiday } from './holiday';
import { Memory } from './memory';
import { Party } from './party';
import { Song } from './song';
import { AudioBook } from './audio-book';

export type MatchingItem<T> = { pid: number; weight: number; item: Translatable<T> };


export const MatchingItemC = <T extends t.Mixed>(codec: T): t.Type<MatchingItem<t.TypeOf<T>>> =>
  t.type({pid: t.number, weight: t.number, item: TranslatableC(codec)})

export const MatchingItemsProps = {
    book: MatchingItemC(Book),
    grandparents: MatchingItemC(Grandparents),
    holidays: MatchingItemC(Holiday),
    memory: MatchingItemC(Memory),
    party: MatchingItemC(Party),
    song: MatchingItemC(Song),
    speaking_book: MatchingItemC(AudioBook),
}
export const MatchingItemsC = t.type(MatchingItemsProps);
export type MatchingItems = t.TypeOf<typeof MatchingItemsC>;


