import * as t from 'io-ts';

export const numberInRange = (min: number, max: number) => t.refinement(
  t.number,
  (n): n is number => n >= min && n <= max,
  'NumberInRange'
);
