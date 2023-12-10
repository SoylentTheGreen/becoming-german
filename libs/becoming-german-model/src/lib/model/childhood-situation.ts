import * as t from 'io-ts';
import { siblingPositionType } from './sibling-position';
import { siblingStateType } from './sibling-states';
import { genderType } from './gender';
import { parentalSituationType } from './parental-situation';
import { bedroomSituationType } from './bedroom-situation';
import { dwellingSituationType } from './dwelling-situation';
import { homeMovesType } from './home-moves';
import { germanStateType } from './german-state';
import { NumberFromStringOrNumber } from '@becoming-german/tools';

export const ChildhoodSituationProps = {
  gender: genderType.literals,
  parents: parentalSituationType.literals,
  siblings: siblingStateType.literals,
  siblingPosition: siblingPositionType.literals,
  bedroomSituation: bedroomSituationType.literals,
  dwellingSituation: dwellingSituationType.literals,
  moves: homeMovesType.literals,
};

export const ChildhoodSituationC = t.type({
  birthYear: t.refinement(
    NumberFromStringOrNumber, (n) => t.Integer.is(n) && n > 1900 && n < new Date().getFullYear() - 15
  ),
  germanState: germanStateType.literals,
  ...ChildhoodSituationProps,
});

export type ChildhoodSituation = t.TypeOf<typeof ChildhoodSituationC>;

export const MatchingProfileRequestC = t.type({
  ...ChildhoodSituationProps,
  favoriteColor: t.string,
  hobby: t.string,
  birthYear: t.refinement(
    NumberFromStringOrNumber,
    (n) => Number.isInteger(n) && n > 1900 && n < new Date().getFullYear() - 10,
  ),
  eastOnly: t.union([t.boolean, t.null]),
  westOnly: t.union([t.boolean, t.null]),
});

export type MatchingProfileRequest = t.TypeOf<typeof MatchingProfileRequestC>;
