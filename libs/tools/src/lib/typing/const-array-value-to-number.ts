export const constArrayValueToNumber = <T extends readonly unknown[]>(constArray: T) =>
  (i: T): number => constArray.indexOf(i)
