import * as t from 'io-ts';
import { literalStringArrayTyping } from '@becoming-german/tools';

export const partyLikes = ['very', 'not', 'ok'] as const;
export type PartyLike = (typeof partyLikes)[number];
export const partyLikeType = literalStringArrayTyping('partyLike', [...partyLikes]);

export const partyProps = {
  reason: t.string,
  food: t.string,
  likeParty: partyLikeType.literals,
  favoriteFood: t.string,
  game: t.string,
  favoriteGame: t.string,
  worstGame: t.string,
  specialMemory: t.string,
};
export const Party = t.type(partyProps);
export type Party = t.TypeOf<typeof Party>;
