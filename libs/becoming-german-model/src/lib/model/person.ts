import * as t from 'io-ts';
import { ChildhoodProfile } from './childhood-profile';
import { languageType } from './language';
import { germanStateType } from './german-state';

export const Memory = t.exact(t.type({ memory: t.string, language: languageType.literals }));
export const DonatedProfile = t.intersection([
  ChildhoodProfile,
  t.exact(
    t.type({
      germanState: germanStateType.literals,
      dwellingSituationComment: t.string,
      memory: t.array(Memory),
    }),
  ),
]);

export const Person = t.intersection([DonatedProfile, t.type({ id: t.union([t.string, t.number]) })]);

export type Person = t.TypeOf<typeof Person>;
