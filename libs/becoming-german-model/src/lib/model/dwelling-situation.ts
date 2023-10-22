import { literalStringArrayTyping } from "@becoming-german/tools";

export const dwellingSituations = [
  "in a city",
  "in a town",
  "in a suburb",
  "in a small town",
  "in the country",
  "in a village"
];
export type DwellingSituation = (typeof dwellingSituations)[number];
export const dwellingSituationType = literalStringArrayTyping(dwellingSituations);
