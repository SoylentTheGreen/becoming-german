import * as t from 'io-ts';
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
import { DbSafeString } from './db-safe-string';

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
    hobby: DbSafeString,
  }),
);
export type ChildhoodProfileTable = t.TypeOf<typeof ChildhoodProfileTable>
