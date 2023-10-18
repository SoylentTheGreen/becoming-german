import { isInConstArray, numTo1BasedConst } from "./typing";

export const typeUtil = <T extends readonly unknown[]>(constArray: T) => ({
  values    : constArray,
  guard     : isInConstArray(constArray),
  fromNumber: numTo1BasedConst(constArray, '__UNKNOWN__'),
  toNumber  : (t: T) => constArray.indexOf(t) + 1
});
