import * as t from 'io-ts';
import { Book } from './book';
import { Item } from './item';
import { Grandparents } from './grandparents';
import { Holiday } from './holiday';
import { Memory } from './memory';
import { Party } from './party';
import { Song } from './song';
import { AudioBook } from './audio-book';

export const ChildhoodItems: Record<Item, t.Mixed> = {
  book         : Book,
  grandparents : Grandparents,
  holidays     : Holiday,
  memory       : Memory,
  party        : Party,
  song         : Song,
  speaking_book: AudioBook

}
