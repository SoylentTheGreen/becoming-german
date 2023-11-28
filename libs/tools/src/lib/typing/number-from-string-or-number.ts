import * as t from 'io-ts';
import { NumberFromString } from 'io-ts-types';

export const NumberFromStringOrNumber = new t.Type<number, number>(
  'NumberFromStringOrNumber',
  (v: unknown): v is number => t.number.is(v) || NumberFromString.is(v),
  (v, c) => (typeof v === 'number' ? t.number.validate(v, c) : NumberFromString.validate(v, c)),
  t.identity,
);
