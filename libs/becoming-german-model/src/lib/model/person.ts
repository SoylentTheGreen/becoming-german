import { ParentalSituation } from './parental-situation';
import { SiblingState } from './sibling-states';
import { SiblingPosition } from './sibling-position';
import { Gender } from './gender';
import { BedroomSituation } from './bedroom-situation';
import { DwellingSituation } from './dwelling-situation';
import { Unknown } from './unknown';

export type Person = {
  id: string;
  gender: Gender | Unknown;
  birthDate: string;
  siblings: SiblingState | Unknown;
  siblingPosition: SiblingPosition | Unknown;
  parents: ParentalSituation | Unknown;
  bedroomSituation: BedroomSituation | Unknown;
  dwellingSituation: DwellingSituation | Unknown;
  dwellingSituationComment: string;
};


