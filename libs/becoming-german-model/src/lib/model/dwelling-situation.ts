import { literalStringArrayTyping } from '@becoming-german/tools';

export const dwellingSituations = ['city', 'town', 'suburb', 'small_town', 'country', 'village', 'other'] as const;

export type DwellingSituation = (typeof dwellingSituations)[number];
export const dwellingSituationType = literalStringArrayTyping<DwellingSituation>('DwellingSituation', [
  ...dwellingSituations,
]);
