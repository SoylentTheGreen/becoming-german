import { literalStringArrayTyping } from '@becoming-german/tools';

export const parentalSituations = ['parents', 'father', 'mother', 'other'] as const;
export type ParentalSituation = (typeof parentalSituations)[number];
export const parentalSituationType = literalStringArrayTyping<ParentalSituation>('ParentalSituation', [
  ...parentalSituations,
]);
