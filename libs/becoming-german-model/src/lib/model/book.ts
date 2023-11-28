import * as t from 'io-ts';
import { childhoodAgeType } from './childhood-age';
import { bookReadByType } from './book-read-by';

export const Book = t.type({
  title: t.string,
  author: t.string,
  character1: t.string,
  character2: t.string,
  synopsis: t.string,
  whyFavorite: t.string,
  howItInfluenced: t.string,
  ageWhenRead: childhoodAgeType.literals,
  readBy: bookReadByType.literals,
});
export type Book = t.TypeOf<typeof Book>;
