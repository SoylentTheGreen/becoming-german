import * as t from 'io-ts';
import {
  ChildhoodSituation,
  ChildhoodSituationC, germanStates, germanStateType,
  Item,
  items,
  ItemToggleValue,
  MatchingProfileRequest, stateIsEast,
} from '@becoming-german/model';
import { fMapping } from './field-mapping';
import {
  ChildhoodProfileRequestTable,
  ChildhoodProfileRequestTableC,
  ChildhoodProfileTable,
} from './childhood-profile-table';
import { pipe } from 'fp-ts/function';
import { toEntries } from 'fp-ts/Record';
import * as A from 'fp-ts/Array';
import { weights } from './weights';
import { itemQueryTable } from './item-query-table';
import { UUID } from 'io-ts-types';
import { not } from 'fp-ts/Predicate';

export const PersonTable = t.type({
  id: UUID,
  legacyId: t.number,
  situation: ChildhoodSituationC,
  profile: t.type({
    de: ChildhoodProfileTable,
    en: ChildhoodProfileTable,
  }),
});
export type PersonTable = t.TypeOf<typeof PersonTable>;
const personTableMappingConfig: ([keyof ChildhoodSituation, string?] | [keyof PersonTable])[] = [
  ['bedroomSituation'],
  ['birthYear', 'YEAR(birthDate)'],
  ['dwellingSituation'],
  ['parents'],
  ['gender', 'sex'],
  ['germanState'],
  ['moves', 'homeMoves'],
  ['siblingPosition'],
  ['siblings'],
];
const personTableMapping = personTableMappingConfig.map(([a, b]) => fMapping(a, `${b || a}`));

export const countPersonSql = `SELECT count(*) as total from tbl_german_person WHERE isQuarantined=0`;

export const getNormalizePersonSql = (offset = 0, limit = 10) => {
  return `select id, jsonData from tbl_german_person where id > ${offset} AND isQuarantined = false limit ${limit}`;
};

const itemToTbl = (i: string) => (i === 'audioBook' ? 'speaking_book' : i);
export const getPersonSql = (offset = 0, limit = 10) => {
  const items = (lang = '') =>
    pipe(
      itemQueryTable,
      toEntries,
      A.map(
        ([k, v]) =>
          `'${k}', (SELECT ${v} 
        FROM ${lang}tbl_${itemToTbl(k)}  
        WHERE pid=p.id LIMIT 1)`,
      ),
      A.concat(
        ['favoriteColor', 'hobby', 'hatedFood', 'softToy', 'dwellingSituationComment'].flatMap((a) => [
          `'${a}'`,
          lang == '' ? a : `''`,
        ]),
      ),
    ).join(',');

  return `
  SELECT id, json_object('situation', json_object(
  ${personTableMapping.join(', ')}), 'profile', json_object('de', json_object(${items('')}), 'en', json_object(${items(
    'eng_',
  )})), 'id', uuid, 'legacyId', id) as json_mapping
  FROM tbl_german_person p
  WHERE 
    isQuarantined=0
    AND p.id > ${offset}
  ORDER BY p.id  
  LIMIT ${limit}`;
};

const fieldName = (k: keyof MatchingProfileRequest): string =>
  k === 'gender' ? 'sex' : k === 'moves' ? 'homeMoves' : k;

export const getSearch = (p: ChildhoodProfileRequestTable) => {
  const data = ChildhoodProfileRequestTableC.encode(p);
  const limitEastWest = (eastOnly = false) => {
    const f = eastOnly ? stateIsEast : not(stateIsEast);
    return germanStates.filter(f).map(germanStateType.fromNumber.encode).join(',')

  }
  const getEW = limitEastWest(p.eastOnly);

  const weightField = `
      IF(
      ABS(DATE_FORMAT(birthDate,"%Y")-${p.birthYear}) <= ${weights.birthYear}, 
      ${weights.birthYear} - ABS(DATE_FORMAT(birthDate,"%Y")-${p.birthYear}), 0)+
      ${Object.entries(weights)
        .filter(([k]) => k !== 'birthYear')
        .map(([k, v]: [keyof MatchingProfileRequest, number]) => `if(${fieldName(k)}=${data[k]}, ${v}, 0)`)
        .join('+')}`;
  const divisor = Object.values(weights).reduce((r, v) => r + v, 0);

  const getSql = (k: Item) => `
  SELECT p.id, ${weightField} as weight,
   json_object('${k}', 
    json_object( 
    'weight', (${weightField}) / ${divisor} * 100,
    'pid', p.id,
    'item',${itemQueryTable[k]})) as jsonItem
  FROM tbl_german_person p inner join tbl_${itemToTbl(k)} i ON p.id = i.pid
  WHERE 
  items_de & ${ItemToggleValue[k]} AND p.germanState in(${getEW})
  AND  isQuarantined = 0
  ORDER BY weight DESC LIMIT 1`;

  return items.map((i) => `(${getSql(i)})`);


};

