import { bedroomSituationType, genderType, siblingPositionType, siblingStateType } from '@becoming-german/model';
import * as t from 'io-ts';

export const PersonTable = t.type({
  id: t.number,
  sex: genderType.fromNumber,
  birthDate: t.string,
  siblings: siblingStateType.fromNumber,
  siblingPosition: siblingPositionType.fromNumber,
  bedroomSituation: bedroomSituationType.fromNumber,
});
export type PersonTable = t.TypeOf<typeof PersonTable>;
