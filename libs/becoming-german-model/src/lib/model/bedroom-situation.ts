import { literalStringArrayTyping } from '@becoming-german/tools';

export const bedroomSituations = [
  'own',
  'sister',
  'brother',
  'several',
  'various',
] as const;
export type BedroomSituation = (typeof bedroomSituations)[number];
export const bedroomSituationType = literalStringArrayTyping<BedroomSituation>('BedroomSituation', [
  ...bedroomSituations,
]);
