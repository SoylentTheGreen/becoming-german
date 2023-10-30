import * as t from 'io-ts';
import { escape as mysqlEscape } from 'mysql';
import {
  bedroomSituationType,
  DateOnlyInput,
  dwellingSituationType,
  genderType,
  homeMovesType,
  parentalSituationType,
  siblingPositionType,
  siblingStateType,
} from '@becoming-german/model';
export const DbSafeString = new t.Type('mysqlsafestring', t.string.is, t.string.validate, mysqlEscape);

export const ChildhoodProfileTable = t.exact(
  t.type({
    gender: genderType.fromNumber,
    birthDate: DateOnlyInput,
    siblings: siblingStateType.fromNumber,
    siblingPosition: siblingPositionType.fromNumber,
    bedroomSituation: bedroomSituationType.fromNumber,
    dwellingSituation: dwellingSituationType.fromNumber,
    moves: homeMovesType.fromNumber,
    parents: parentalSituationType.fromNumber,
    favoriteColor: DbSafeString,
    hobby: DbSafeString
  }),
);
export type ChildhoodProfileTable = t.TypeOf<typeof ChildhoodProfileTable>
