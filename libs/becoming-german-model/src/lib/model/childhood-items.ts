import * as t from 'io-ts';
import { Book } from './book';
import { Grandparents } from './grandparents';
import { Holiday } from './holiday';
import { Party } from './party';
import { Song } from './song';
import { AudioBook } from './audio-book';

export const ChildhoodItems = {
  book: Book,
  grandparents: Grandparents,
  holidays: Holiday,
  party: Party,
  song: Song,
  audioBook: AudioBook,
};
