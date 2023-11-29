import * as t from 'io-ts';
import { NumberFromStringOrNumber } from './number-from-string-or-number';

export const numberInRange = (min: number, max: number) => t.refinement(
  NumberFromStringOrNumber,
  (n): n is number => n >= min && n <= max,
  'NumberInRange'
);
