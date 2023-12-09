import * as t from 'io-ts';
import {
  bedroomSituationType,
  dwellingSituationType,
  genderType,
  Grandparents,
  Holiday,
  homeMovesType,
  parentalSituationType,
  siblingPositionType,
  siblingStateType,
} from '@becoming-german/model';
import { DbSafeString } from './db-safe-string';
import { DateFromISOString } from 'io-ts-types';
import { numberInRange } from '@becoming-german/tools';
import { BookItem } from './book-item';
import { PartyItem } from './party-item';
import { SongItem } from './song-item';
import { AudioBookItem } from './audio-book-item';

const base = {
  gender: genderType.fromNumber,
  siblings: siblingStateType.fromNumber,
  siblingPosition: siblingPositionType.fromNumber,
  bedroomSituation: bedroomSituationType.fromNumber,
  dwellingSituation: dwellingSituationType.fromNumber,
  moves: homeMovesType.fromNumber,
  parents: parentalSituationType.fromNumber,
};
export const ChildhoodProfileRequestTableC = t.type({
  ...base,
  birthYear: numberInRange(1900, new Date().getFullYear() - 10),
});

export type ChildhoodProfileRequestTable = t.TypeOf<typeof ChildhoodProfileRequestTableC>;

export const ChildhoodSituationTableC = t.type({
  ...base,
  birthDate: DateFromISOString,
});
export type ChildhoodSituationTable = t.TypeOf<typeof ChildhoodSituationTableC>;

export const ChildhoodProfileTable = t.type({
  favoriteColor: t.union([t.null, DbSafeString]),
  hobby: t.union([t.null, DbSafeString]),
  hatedFood: t.union([t.null, DbSafeString]),
  softToy: t.union([t.null, DbSafeString]),
  dwellingSituationComment: t.union([t.null, DbSafeString]),
  book: t.union([t.null, BookItem]),
  grandparents: t.union([t.null, Grandparents]),
  holidays: t.union([t.null, Holiday]),
  memory: t.union([t.null, t.string]),
  party: t.union([t.null, PartyItem]),
  song: t.union([t.null, SongItem]),
  audioBook: t.union([t.null, AudioBookItem]),
});
export type ChildhoodProfileTable = t.TypeOf<typeof ChildhoodProfileTable>;
