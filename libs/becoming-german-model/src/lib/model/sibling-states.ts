import { literalStringArrayTyping } from "@becoming-german/tools";

export const siblingStates = [
  "none",
  "one",
  "two",
  "three",
  "four",
  "five",
  "more than five"
] as const;
export type SiblingState = (typeof siblingStates)[number];
export const siblingStateType = literalStringArrayTyping(siblingStates);
