import * as t from 'io-ts';
import { fMapping } from './field-mapping';
import { bookReadByType, childhoodAgeType, Language, languageType } from '@becoming-german/model';

export const BookTable = t.exact(
  t.type({
    id: t.number,
    language: languageType.literals,
    title: t.string,
    author: t.string,
    character1: t.string,
    character2: t.string,
    synopsis: t.string,
    whyFavorite: t.string,
    howItInfluenced: t.string,
    ageWhenRead: childhoodAgeType.fromNumber,
    readBy: bookReadByType.fromNumber,
  }),
);
const bookTableMapping = (tbl: string, language: Language = 'de') =>
  [
    ['id', `${tbl}.id`],
    ['language', `'${language}'`],
    ['author'],
    ['title'],
    ['character1'],
    ['character2'],
    ['synopsis'],
    ['whyFavorite'],
    ['howItInfluenced'],
    ['ageWhenRead'],
    ['readBy']
  ].map(([a, b]) => fMapping(a, b));
export const _getBookSql = (tbl: string, language: Language) =>
  `SELECT 
    json_array(json_object(${bookTableMapping(tbl, language).join(',')})) 
   FROM ${tbl} 
   where 
    ${tbl}.pid=p.id 
    AND ${tbl}.ageWhenRead != 0
    AND ${tbl}.readBy != 0
    `;

export const getBookSql = () => `${_getBookSql('tbl_book', 'de')} UNION ${_getBookSql('eng_tbl_book', 'en')}`;



