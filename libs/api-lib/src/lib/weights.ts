import { ChildhoodProfileTable } from './childhood-profile-table';

export const weights: Record<keyof ChildhoodProfileTable, number> = {
  birthDate        : 5,
  bedroomSituation : 1,
  dwellingSituation: 1,
  parents          : 1,
  siblingPosition  : 1,
  siblings         : 1,
  moves            : 1,
  favoriteColor    : 0,
  hobby            : 0,
  gender           : 8,
};
