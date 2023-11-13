import * as t from 'io-ts';
import {
  germanStateType,
  Grandparents,
  Holiday,
  Item,
  items,
  ItemToggleValue,
  Memory,
  NullableTranslatableC,
} from '@becoming-german/model';
import { fMapping } from './field-mapping';
import { ChildhoodProfileTable } from './childhood-profile-table';
import { pipe } from 'fp-ts/function';
import { toEntries } from 'fp-ts/Record';
import * as A from 'fp-ts/Array';
import { BookItem } from './book-item';
import { SongItem } from './song-item';
import { weights } from './weights';
import { itemQueryTable } from './item-query-table';
import { PartyItem } from './party-item';
import { AudioBookItem } from './audio-book-item';

const itemsProps = {
  book: NullableTranslatableC(BookItem),
  grandparents: NullableTranslatableC(Grandparents),
  holidays: NullableTranslatableC(Holiday),
  memory: NullableTranslatableC(Memory),
  party: NullableTranslatableC(PartyItem),
  song: NullableTranslatableC(SongItem),
  speaking_book: NullableTranslatableC(AudioBookItem),
};

export const PersonTable = t.intersection([
  t.exact(
    t.type({
      id: t.number,
      dwellingSituationComment: NullableTranslatableC(t.string),
      germanState: germanStateType.fromNumber,
      ...itemsProps
    }),
  ),
  ChildhoodProfileTable,
]);
export type PersonTable = t.TypeOf<typeof PersonTable>;
const personTableMappingConfig: ([keyof PersonTable, string?] | [keyof PersonTable])[] = [
  ['bedroomSituation'],
  ['birthYear', 'DATE_FORMAT(birthDate,"%Y")'],
  ['dwellingSituation'],
  ['dwellingSituationComment'],
  ['parents'],
  ['gender', 'sex'],
  ['germanState'],
  ['id'],
  ['moves', 'homeMoves'],
  ['siblingPosition'],
  ['siblings'],
  ['hobby'],
  ['favoriteColor'],
];
const personTableMapping = personTableMappingConfig.map(([a, b]) => fMapping(a, `p.${b || a}`));


export const countPersonSql = `SELECT count(*) as total from tbl_german_person WHERE isQuarantined=0`;

export const getNormalizePersonSql = (offset = 0, limit = 10) => {
  return `select id, jsonData from tbl_german_person where id > ${offset} AND isQuarantined = false limit ${limit}`;
}

export const getPersonSql = (offset = 0, limit = 10) => {
  const items = pipe(
    itemQueryTable,
    toEntries,
    A.map(
      ([k, v]) =>
        `'${k}', (
        SELECT ${v} 
        FROM tbl_${k} de_${k} LEFT JOIN eng_tbl_${k} en_${k} ON de_${k}.id=en_${k}.id 
        WHERE de_${k}.pid=p.id LIMIT 1
        )`,
    ),
  ).join(',');
  return `
  SELECT json_object(${personTableMapping.join(', ')}, ${items} ) as json_mapping
  FROM tbl_german_person p
  WHERE 
    isQuarantined=0
    AND p.id > ${offset}
  ORDER BY p.id  
  LIMIT ${limit}`;
};

const fieldName = (k: keyof ChildhoodProfileTable): string =>
  k === 'gender' ? 'sex' : k === 'moves' ? 'homeMoves' : k;

export const getSearch = (p: ChildhoodProfileTable) => {
  const data = ChildhoodProfileTable.encode(p);

  const weightField = `
      IF(
      ABS(DATE_FORMAT(birthDate,"%Y")-${p.birthYear}) <= ${weights.birthYear}, 
      ${weights.birthYear} - ABS(DATE_FORMAT(birthDate,"%Y")-${p.birthYear}), 0)+
      ${Object.entries(weights)
        .filter(([k]) => k !== 'birthYear')
        .map(([k, v]: [keyof ChildhoodProfileTable, number]) => `if(${fieldName(k)}=${data[k]}, ${v}, 0)`)
        .join('+')}`;
  const divisor = Object.values(weights).reduce((r, v) => r + v, 0);

  const getSql = (k: Item) => `
  SELECT p.id, ${weightField} as weight, json_object('${k}', json_object(
  'weight', (${weightField}) / ${divisor} * 100,
  'pid', p.id,
  'item', JSON_EXTRACT(jsonData, '$.${k}'))) as jsonItem
  FROM tbl_german_person p
  WHERE 
  items_de & ${ItemToggleValue[k]}
  AND  isQuarantined = 0
  ORDER BY weight DESC LIMIT 1`;
  const sql = items.map((i) => `(${getSql(i)})`);

  //   const sql = `
  //
  //   SELECT p.id, ${weightField} / ${divisor} * 100 as weight, json_object(
  //   'weight', ${weightField} / ${divisor} * 100,
  //   'memory', JSON_OBJECT('de', item.diverse, 'en', eItem.diverse)) as jsonItem
  // FROM tbl_german_person p
  //          JOIN (tbl_memory item LEFT JOIN eng_tbl_memory eItem ON item.id = eItem.id) ON p.id = item.pid
  // WHERE item.id is not null ORDER BY weight DESC LIMIT 1`;
  //   const sql =  pipe(
  //     itemTables,
  //     toEntries,
  //     A.map(
  //       ([item]) =>
  //         `
  //     (SELECT
  //
  //       JSON_OBJECT(
  //
  //       '${item}', (${getItemSql(item)})) as jsonResult
  //       FROM tbl_german_person, ${getItemTableName(item)} b
  //       WHERE b.pid = tbl_german_person.id
  //       AND ${weightField} > 0
  //       ORDER BY weight DESC
  //       limit 1)
  // `,
  //     ),
  //   ).join(' UNION ');

  return sql;
};

/*
const t = `
    (SELECT
      (${weightField}) / ${divisor} * 100 as weight,
      JSON_OBJECT(
      'weight',  (${weightField}) / ${divisor} * 100,
      '${item}', (${getItemSql(item)})) as jsonResult
      FROM tbl_german_person, ${getItemTableName(item)} b
      WHERE
      b.pid = tbl_german_person.id
      AND ${weightField} > 0
      ORDER BY weight DESC
      limit 1)
`
 */
