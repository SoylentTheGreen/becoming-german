import * as t from 'io-ts';
import { bookReadByType, childhoodAgeType } from '@becoming-german/model';
import { PersonItemTable } from './person-item-table';

export const BookItem = t.type({
  title: t.string,
  author: t.string,
  character1: t.string,
  character2: t.string,
  synopsis: t.string,
  whyFavorite: t.string,
  howItInfluenced: t.string,
  ageWhenRead: childhoodAgeType.fromNumber,
  readBy: bookReadByType.fromNumber,
});
export const BookItemTable = t.intersection([PersonItemTable, BookItem]);
