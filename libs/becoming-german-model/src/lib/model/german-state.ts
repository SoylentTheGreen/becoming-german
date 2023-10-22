import { literalStringArrayTyping } from "@becoming-german/tools";

export const germanStates = [
  'Baden-Wurttemberg',
  'Bavaria',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hesse',
  'Mecklenburg-Western Pomerania',
  'Lower Saxony',
  'North Rhine-Westphalia',
  'Rhineland-Palatinate',
  'Saarland',
  'Saxony',
  'Saxony-Anhalt',
  'Schleswig-Holstein',
  'Thuringia'
] as const;
export type GermanState = (typeof germanStates)[number];
export const germanStateType = literalStringArrayTyping(germanStates);
export const stateIsEast = (s: GermanState) => [
  "Mecklenburg-Western Pomerania",
  "Brandenburg",
  "Saxony",
  "Saxony-Anhalt",
  "Thuringa"
].includes(s);
