import { MatchingProfileRequest } from '@becoming-german/model';

export const weights: Record<
  keyof Omit<MatchingProfileRequest, 'hobby' | 'favoriteColor' | 'eastOnly' | 'westOnly'>,
  number
> = {
  birthYear: 5,
  bedroomSituation: 1,
  dwellingSituation: 1,
  parents: 1,
  siblingPosition: 1,
  siblings: 1,
  moves: 1,
  gender: 8,
};
