import * as t from 'io-ts';

import { numberInRange } from '@becoming-german/tools';
import { siblingPositionType } from './sibling-position';
import { siblingStateType } from './sibling-states';
import { genderType } from './gender';
import { parentalSituationType } from './parental-situation';
import { bedroomSituationType } from './bedroom-situation';
import { dwellingSituationType } from './dwelling-situation';
import { homeMovesType } from './home-moves';
import { germanStateType } from './german-state';

const NonEmptyString = t.refinement(t.string, (n) => n.trim() !== '');

export const ChildhoodProfile = t.type({
  birthYear: numberInRange(1900, new Date().getFullYear() - 10),
  gender: genderType.literals,
  parents: parentalSituationType.literals,
  siblings: siblingStateType.literals,
  siblingPosition: siblingPositionType.literals,
  bedroomSituation: bedroomSituationType.literals,
  dwellingSituation: dwellingSituationType.literals,
  moves: homeMovesType.literals,
  hobby: NonEmptyString,
  favoriteColor: NonEmptyString,
  germanState: t.union([t.null, germanStateType.literals]),
});

export type ChildhoodProfile = t.TypeOf<typeof ChildhoodProfile>;
export type ChildhoodProfileOutput = t.OutputOf<typeof ChildhoodProfile>;
