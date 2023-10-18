import { typeUtil } from "@becoming-german/tools";

const homeMoves = ["never", "once", "twice", "more than twice"];
export type HomeMoves = (typeof homeMoves)[number];
export const homeMovesType = typeUtil(homeMoves);
