import { typeUtil } from "@becoming-german/tools";

export const siblingPositions = [
  "only child",
  "eldest child",
  "middle child",
  "youngest child"
] as const;
export type SiblingPosition = (typeof siblingPositions)[number];
export const siblingPositionType = typeUtil(siblingPositions);
