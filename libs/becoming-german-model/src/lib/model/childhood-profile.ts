import * as t from 'io-ts';

import { siblingPositionType } from './sibling-position';
import { siblingStateType } from './sibling-states';
import { genderType } from './gender';
import { parentalSituationType } from './parental-situation';
import { bedroomSituationType } from './bedroom-situation';
import { dwellingSituationType } from './dwelling-situation';
import { homeMovesType } from './home-moves';
import { numberInRange } from '@becoming-german/tools';


export const ChildhoodProfile = t.exact(
  t.type({
    birthYear: numberInRange(1900, new Date().getFullYear() - 10),
    gender: genderType.literals,
    parents: parentalSituationType.literals,
    siblings: siblingStateType.literals,
    siblingPosition: siblingPositionType.literals,
    bedroomSituation: bedroomSituationType.literals,
    dwellingSituation: dwellingSituationType.literals,
    moves: homeMovesType.literals,
    hobby: t.string,
    favoriteColor: t.string,
  }),
);

export type ChildhoodProfile = t.TypeOf<typeof ChildhoodProfile>;
export type ChildhoodProfileOutput = t.OutputOf<typeof ChildhoodProfile>;
