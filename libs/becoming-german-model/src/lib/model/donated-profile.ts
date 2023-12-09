import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { ChildhoodSituationC } from './childhood-situation';
import { NullableTranslatableC, TranslatableC } from './nullableTranslatable';
import { UUID } from 'io-ts-types';
import { pipe } from 'fp-ts/function';
import { v4 as uuid } from 'uuid';
import { items, searchableItems } from './item';

export const childhoodProfileProps = {
  hobby: t.union([t.null, t.string]),
  favoriteColor: t.union([t.null, t.string]),
  hatedFood: t.union([t.null, t.string]),
  dwellingSituationComment: t.union([t.null, t.string]),
  ...searchableItems,
};

export const ChildhoodProfileC = t.type(childhoodProfileProps);
export type ChildhoodProfile = t.TypeOf<typeof ChildhoodProfileC>

export const DonatedProfileC = t.type({
  id: UUID,
  legacyId: t.union([t.null, t.number]),
  situation: ChildhoodSituationC,
  profile: NullableTranslatableC(ChildhoodProfileC)
});
export type DonatedProfile = t.TypeOf<typeof DonatedProfileC>;

export interface ChildhoodBrand {
  readonly Childhood: unique symbol;
}
// This is the DonatedProfile with at least one Item set.
export const ChildhoodC = t.brand(
  t.type({...DonatedProfileC.props, profile: TranslatableC(ChildhoodProfileC)}),
  (dp): dp is t.Branded<typeof dp, ChildhoodBrand> => items.some((i) => dp.profile.de && dp.profile.de[i] != null),
  'Childhood',
);
export type Childhood = t.TypeOf<typeof ChildhoodC>;

export type SearchableProfile = t.TypeOf<typeof ChildhoodC>;
export type SearchableProfileOut = t.OutputOf<typeof ChildhoodC>;


export const createProfile = (payload: unknown) => {
  pipe(
    DonatedProfileC.decode(payload),
    E.map((p) => ({ ...p, id: uuid() })),
    E.chain(ChildhoodC.decode),
  );
};
