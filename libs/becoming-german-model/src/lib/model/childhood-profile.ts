import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types';

import { siblingPositionType } from './sibling-position';
import { siblingStateType } from './sibling-states';
import { genderType } from './gender';
import { parentalSituationType } from './parental-situation';
import { bedroomSituationType } from './bedroom-situation';
import { dwellingSituationType } from './dwelling-situation';
import { homeMovesType } from './home-moves';
import { germanStateType } from './german-state';

// Custom codec to handle either Date instances or ISO strings.
export const DateOrDateString = new t.Type<Date, Date, unknown>(
  'DateOrDateString',
  (u): u is Date => u instanceof Date || typeof u === 'string',
  (u, c) =>
    // If the input is a Date instance, we consider it valid.
    u instanceof Date
      ? t.success(u)
      : // If the input is a string, we use the existing DateFromISOString codec to validate and parse it.
        DateFromISOString.validate(u, c),
  // The output representation is a Date instance, whether the input was a Date or a string.
  t.identity,
);

export const ChildhoodProfile = t.exact(
  t.type({
    birthDate: DateOrDateString,
    gender: genderType.literals,
    parents: parentalSituationType.literals,
    siblings: siblingStateType.literals,
    germanState: germanStateType.literals,
    siblingPosition: siblingPositionType.literals,
    bedroomSituation: bedroomSituationType.literals,
    dwellingSituation: dwellingSituationType.literals,
    moves: homeMovesType.literals,
  }));

export type ChildhoodProfile = t.TypeOf<typeof ChildhoodProfile>;
