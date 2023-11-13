import * as t from 'io-ts';
import {
  bedroomSituationType,
  dwellingSituationType,
  genderType,
  homeMovesType,
  parentalSituationType,
  siblingPositionType,
  siblingStateType,
} from '@becoming-german/model';
import { DbSafeString } from './db-safe-string';
import { UUID } from 'io-ts-types';
import { numberInRange } from '@becoming-german/tools';

export const ChildhoodProfileTable = t.exact(
  t.type({
    id: UUID,
    gender: genderType.fromNumber,
    birthYear: numberInRange(1900, new Date().getFullYear() - 10),
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
