import { createPool } from 'mysql';

import { pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import { isLeft } from 'fp-ts/Either';
import { fromEither } from 'fp-ts/Option';
import * as t from 'io-ts';
import { Validation } from 'io-ts';
import {
  bedroomSituationType,
  dwellingSituationType,
  genderType,
  germanStateType,
  homeMovesType,
  siblingPositionType,
  siblingStateType,
} from '@becoming-german/model';
import { dbConfig } from './config';
import { PathReporter } from 'io-ts/PathReporter';

const processItem = (item: unknown): Validation<PersonTable> => {
  const validationResult = PersonTable.decode(item);

  if (isLeft(validationResult)) {
    console.error(
      `Validation failed! on ${item['id']}`,
      JSON.stringify(PathReporter.report(validationResult), undefined, 4),
    );
  }

  return validationResult;
};

export class PersonService {
  private connection = createPool(dbConfig);

  async getData(): Promise<unknown[]> {
    try {
      const rows: unknown[] = await new Promise((res, rej) => {
        this.connection.query(
          `SELECT p.*, 
            IFNULL(m.diverse, "") as memory,
            IFNULL(em.diverse, "") as memoryEnglish,
            sex as gender, 
            homeMoves as moves
          FROM tbl_german_person p LEFT JOIN tbl_memory m ON p.id = m.pid LEFT JOIN eng_tbl_memory em ON p.id = em.pid
          WHERE 
            sex != 0
            AND siblings != 0
            AND siblingPosition != 0
            AND parents != 0
            AND bedroomSituation != 0
            AND dwellingSituation != 0
            AND homeMoves != 0
            AND germanState != 0
            AND em.id IS NOT NULL
          LIMIT 10`,
          (e, r) => (e ? rej(e) : res(r)),
        );
      });
      return pipe(rows, A.map(processItem), A.filterMap(fromEither));
    } catch (e: unknown) {
      console.log(JSON.stringify(e, undefined, 4));
      return [];
    }
  }
}

export const BookTable = t.exact(
  t.type({
    id: t.number,
    title: t.string,
    author: t.string,
    character1: t.string,
    character2: t.string,
    synopsis: t.string,
    whyFavorite: t.string,
    howItInfluenced: t.string,
    ageWhenRead: t.number
  }),
);

export const PersonTable = t.exact(
  t.type({
    id: t.number,
    gender: genderType.fromNumber,
    birthDate: t.string,
    siblings: siblingStateType.fromNumber,
    siblingPosition: siblingPositionType.fromNumber,
    bedroomSituation: bedroomSituationType.fromNumber,
    dwellingSituation: dwellingSituationType.fromNumber,
    dwellingSituationComment: t.string,
    moves: homeMovesType.fromNumber,
    germanState: germanStateType.fromNumber,
    memory: t.string,
    memoryEnglish: t.string
  }),
);

export type PersonTable = t.TypeOf<typeof PersonTable>;
