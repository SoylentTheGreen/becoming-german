import { literalStringArrayTyping } from "@becoming-german/tools";

export const bedroomSituations = [
  "own",
  "shared with sister",
  "shared with brother",
  "shared with several siblings",
  "various"
] as const;
export type BedroomSituation = (typeof bedroomSituations)[number];
export const bedroomSituationType = literalStringArrayTyping(bedroomSituations);
