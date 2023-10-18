export const isInConstArray = <T extends readonly unknown[]>(constArray: T) => {
  return (a: unknown): a is T => constArray.includes(a);
}
