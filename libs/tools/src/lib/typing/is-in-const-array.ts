import { isString } from "fp-ts/string";

export const isInConstArray = <T extends string>(constArray: T[]) => {
  return (a: unknown): a is T => isString(a) && constArray.includes(a as T);
}
