import { literalStringArrayTyping } from '@becoming-german/tools';

export const germanStates = [
  'BB',
  'BE',
  'BW',
  'BY',
  'HB',
  'HE',
  'HH',
  'MV',
  'NI',
  'NW',
  'RP',
  'SH',
  'SL',
  'SN',
  'ST',
  'TH',
] as const;

export type GermanState = (typeof germanStates)[number];
export const germanStateType = literalStringArrayTyping<GermanState>('GermanState', [...germanStates]);
export const stateIsEast = (s: GermanState) => ['MV', 'BB', 'SN', 'ST', 'TH'].includes(s);
