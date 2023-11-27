import * as t from 'io-ts';
import { ChildhoodProfile } from './childhood-profile';
import { germanStateType } from './german-state';
import { itemProps } from './item-type-map';
import { NullableTranslatableC } from './nullableTranslatable';

export const DonatedProfile = t.intersection([
  ChildhoodProfile,
  t.exact(
    t.type({
      germanState: germanStateType.literals,
      dwellingSituationComment: NullableTranslatableC(t.string),
      ...itemProps,
    }),
  ),
]);

export const Person = t.intersection([DonatedProfile, t.type({ id: t.union([t.string, t.number]) })]);
export type Person = t.TypeOf<typeof Person>;
export type PersonOut = t.OutputOf<typeof Person>;
