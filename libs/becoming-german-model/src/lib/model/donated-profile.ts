import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { ChildhoodProfile } from './childhood-profile';
import { itemProps, items } from './item-type-map';
import { Translatable, TranslatableC } from './nullableTranslatable';
import { languages } from './language';
import { UUID } from 'io-ts-types';
import { pipe } from 'fp-ts/function';
import { v4 as uuid } from 'uuid';

export const DonatedProfileC = t.type(
  {
    ...ChildhoodProfile.props,
    dwellingSituationComment: t.union([t.null, TranslatableC(t.string)]),
    ...itemProps,
  });
export type DonatedProfile = t.TypeOf<typeof DonatedProfileC>;

const propIsSet = (arg: Translatable<unknown> | null) => arg && languages.some((l) => arg[l] != null);


// This is the DonatedProfile with at least one Item set.
export const SearchableProfileC = t.refinement(
  t.intersection([DonatedProfileC, t.type({ id: UUID })]),
  (dp) => items.some((i) => propIsSet(dp[i])),
  'DonatedProfile',
);

export type SearchableProfile = t.TypeOf<typeof SearchableProfileC>;
export type SearchableProfileOut = t.OutputOf<typeof SearchableProfileC>;


export const createProfile = (payload: unknown) => {
  pipe(
    DonatedProfileC.decode(payload),
    E.map((p) => ({ ...p, id: uuid() })),
    E.chain(SearchableProfileC.decode),
  );
};
