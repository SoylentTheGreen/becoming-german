import { literalStringArrayTyping } from "@becoming-german/tools";

export const parentalSituations = [
  "parents",
  "father",
  "mother",
  "another caregiver"
] as const;
export type ParentalSituation = (typeof parentalSituations)[number];
export const parentalSituationType = literalStringArrayTyping(parentalSituations);
