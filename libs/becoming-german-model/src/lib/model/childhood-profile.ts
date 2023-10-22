import * as t from "io-ts";
import { DateFromISOString } from "io-ts-types";
import { genderType } from "./gender";
import { siblingStateType } from "./sibling-states";
import { siblingPositionType } from "./sibling-position";
import { parentalSituationType } from "./parental-situation";
import { bedroomSituationType } from "./bedroom-situation";
import { dwellingSituationType } from "./dwelling-situation";
import { homeMovesType } from "./home-moves";
import { germanStateType } from "./german-state";

export const ChildhoodProfile = t.type({
                                          birthDate        : DateFromISOString,
                                          gender           : genderType.literals,
                                          siblings         : siblingStateType.literals,
                                          siblingPosition  : siblingPositionType.literals,
                                          parents          : parentalSituationType.literals,
                                          bedroomSituation : bedroomSituationType.literals,
                                          dwellingSituation: dwellingSituationType.literals,
                                          moves            : homeMovesType.literals,
                                          state            : germanStateType.literals
                                        });
export type ChildhoodProfile = t.TypeOf<typeof ChildhoodProfile>;
