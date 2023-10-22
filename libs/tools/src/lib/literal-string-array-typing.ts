import { isInConstArray, numTo1BasedConst } from './typing';
import * as t from 'io-ts';

const isNum = (i: unknown): i is number => Number.isInteger(i);
export const literalStringArrayTyping = <OutType extends string, T extends readonly string[]>(constArray: T) => {
  const literals = t.keyof(constArray.reduce((r, k) => ({ ...r, [k]: null }), {} as Record<OutType, null>));
  const fromNumber = new t.Type<T[number], number, unknown>(
    'testing',
    literals.is,
    (input, context) => {
      const r = isNum(input) ? numTo1BasedConst(constArray)(input) : null;
      return r === null ? t.failure(input, context, 'invalid index') : t.success(r);
    },
    (out: T[number]) => constArray.indexOf(out) + 1,
  );
  return {
    values: constArray,
    guard: isInConstArray(constArray),
    fromNumber,
    literals,
  };
};
