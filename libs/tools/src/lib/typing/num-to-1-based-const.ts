export const numTo1BasedConst = <T extends readonly unknown[]>(constArray: T) =>
  (i: number): T[number] | null => (i < 1 || i > constArray.length) ? null : constArray[i - 1];
