import * as t from 'io-ts';
import { partyLikeType, partyProps } from '@becoming-german/model';

export const PartyItem = t.exact(t.type({ ...partyProps, likeParty: partyLikeType.fromNumber }));
