import * as t from 'io-ts';
import { ymd } from './ymd';

const dateToMidday = (input: Date) => new Date(input.getFullYear(), input.getMonth(), input.getDate(), 12, 0, 0);
const isStringOrNumber = (input: unknown): input is string | number => ['string', 'number'].includes(typeof input);
export const DateOnlyInput = new t.Type<Date, string, unknown>(
  'DateFromStringOrDateObject',
  (input: unknown): input is Date =>
    input instanceof Date ||
    (typeof input === 'string' && !isNaN(Date.parse(input))) ||
    (typeof input === 'number' && !isNaN(new Date(input).valueOf())),
  (input, context) => {

    if (input instanceof Date) return t.success(dateToMidday(input));
    return isStringOrNumber(input)
      ? t.success(dateToMidday(new Date(input)))
      : t.failure(input, context, 'Input must be a number, Date instance or valid string date.');
  },
  ymd
);
