export const numTo1BasedConst = <T extends readonly unknown[], R>(constArray: T, nullReturn: R) =>
  (i: number): T[number] | null => (i < 1 || i > constArray.length) ? nullReturn : constArray[i - 1];
