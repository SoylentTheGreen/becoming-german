import * as t from 'io-ts';
import { ChildhoodProfile } from './childhood-profile';
import { germanStateType } from './german-state';
import { itemProps } from './item-type-map';
import { NullableTranslatableC } from './nullableTranslatable';

export const CountyC = t.keyof({
  'DE': 'Germany',
  'EN': 'England',
  'LT': 'Lithuania'
                               });
export const DonatedProfile = t.intersection([
  ChildhoodProfile,
  t.exact(
    t.type({
      germanState: t.union([germanStateType.literals, t.null]),
      dwellingSituationComment: NullableTranslatableC( t.string),
      country: CountyC,
      ...itemProps,
    }),
  ),
], 'DonatedProfile');

export const Person = DonatedProfile;
export type Person = t.TypeOf<typeof Person>;
export type PersonOut = t.OutputOf<typeof Person>;
