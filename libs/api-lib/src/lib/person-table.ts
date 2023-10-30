import * as t from 'io-ts';
import { germanStateType, languageType } from '@becoming-german/model';
import { BookTable, getBookSql } from './book-table';
import { fMapping } from './field-mapping';
import { ChildhoodProfileTable } from './childhood-profile-table';

export const ChildhoodMemory = t.type({ language: languageType.literals, memory: t.string });

export const PersonTable = t.intersection([
  t.exact(
    t.type({
      id: t.number,
      dwellingSituationComment: t.string,
      germanState: germanStateType.fromNumber,
      memory: t.array(ChildhoodMemory),
      book: t.array(BookTable),
    }),
  ),
  ChildhoodProfileTable,
]);
export type PersonTable = t.TypeOf<typeof PersonTable>;
const personTableMappingConfig: ([keyof PersonTable, string?] | [keyof PersonTable])[] = [
  ['bedroomSituation'],
  ['birthDate'],
  ['dwellingSituation'],
  ['dwellingSituationComment'],
  ['parents'],
  ['gender', 'sex'],
  ['germanState'],
  ['id', 'p.id'],
  [
    'memory',
    `json_array(json_object('language', 'de', 'memory', IFNULL(mem.diverse, "")),json_object('language', 'en', 'memory', IFNULL(memE.diverse, "")))`,
  ],
  ['moves', 'p.homeMoves'],
  ['siblingPosition'],
  ['siblings'],
  ['book', `COALESCE((${getBookSql()}), JSON_ARRAY())`],
];
const personTableMapping = personTableMappingConfig.map(([a, b]) => fMapping(a, b));
const zeroableFields: (keyof PersonTable | 'sex' | 'homeMoves')[] = [
  'birthDate',
  'sex',
  'siblings',
  'siblingPosition',
  'parents',
  'bedroomSituation',
  'dwellingSituation',
  'homeMoves',
  'germanState',
];
const validFieldWhere = zeroableFields.map((f) => `${f} != 0`).join(' AND ');
export const countPersonSql = `SELECT count(*) as total from tbl_german_person WHERE ${validFieldWhere}`;

export const getPersonSql = (offset = 0, limit = 10) =>
  `
  SELECT json_object(${personTableMapping.join(', ')}) as json_mapping
  FROM tbl_german_person p LEFT JOIN tbl_memory mem ON p.id = mem.pid LEFT JOIN eng_tbl_memory memE ON p.id = memE.pid
  WHERE 
    ${validFieldWhere}
  LIMIT ${offset}, ${limit}`;

const fieldName = (k: keyof ChildhoodProfileTable): string =>
  k === 'gender' ? 'sex' : k === 'moves' ? 'homeMoves' : k;

const weights: Record<keyof ChildhoodProfileTable, number> = {
  birthDate: 5,
  bedroomSituation: 1,
  dwellingSituation: 1,
  parents: 1,
  siblingPosition: 1,
  siblings: 1,
  moves: 1,
  favoriteColor: 0,
  hobby: 0,
  gender: 3
};

export const getSearch = (p: ChildhoodProfileTable) => {
  const data = ChildhoodProfileTable.encode(p);
  const yearWeight = 3;
  const weightField = `
      IF(
      ABS(DATE_FORMAT(birthDate,"%Y")-${p.birthDate.getFullYear()}) <= ${weights.birthDate}, 
      ${weights.birthDate} - ABS(DATE_FORMAT(birthDate,"%Y")-${p.birthDate.getFullYear()}), 0)+
      ${Object.entries(weights)
        .filter(([k]) => k !== 'birthDate')
        .map(([k, v]: [keyof ChildhoodProfileTable, number]) => `if(${fieldName(k)}=${data[k]}, ${v}, 0)`)
        .join('+')}`;
  const divisor = yearWeight + Object.values(weights).reduce((r, v) => r + v, 0);

  return `
    SELECT 
      p.id,
      DATE_FORMAT(birthDate,"%Y")-${p.birthDate.getFullYear()} as yearDiff, 
      DATE_FORMAT(birthDate,"%Y") as year,
      (${weightField}) / ${divisor} * 100 as weight
      FROM tbl_german_person p
      WHERE ${weightField} > 0
      AND sex =${data['gender']}
      ORDER BY weight DESC
      limit 10
`;
};
