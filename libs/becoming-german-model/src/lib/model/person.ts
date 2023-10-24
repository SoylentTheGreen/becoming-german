import * as t from 'io-ts';
import { ChildhoodProfile } from './childhood-profile';

export const DonatedProfile = t.intersection([
  ChildhoodProfile,
  t.exact(
    t.type({
      dwellingSituationComment: t.string,
      memory: t.string,
      memoryEnglish: t.string
    }),
  ),
]);

export const Person = t.intersection([DonatedProfile, t.type({ id: t.string })]);

export type Person = t.TypeOf<typeof Person>;
