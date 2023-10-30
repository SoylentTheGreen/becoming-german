import { isInConstArray, numTo1BasedConst } from './index';
import * as t from 'io-ts';
import { fromCompare, Ord } from 'fp-ts/Ord';

const isNum = (i: unknown): i is number => Number.isInteger(i);

export type LiteralMeta<T extends string> = {
  values: T[];
  guard: (a: unknown) => a is T;
  fromNumber: t.Type<T, number>;
  literals: t.Type<T, T>;
  ord: Ord<T>;
};

export const ordFromLiterals = <T>(constArray: T[]): Ord<T> =>
  fromCompare((a, b) => {
    const idxA = constArray.indexOf(a);
    const idxB = constArray.indexOf(b);
    if (idxA === idxB) return 0;
    return idxA > idxB ? 1 : -1;
  });

export const literalStringArrayTyping = <OutType extends string>(
  typeName: string,
  constArray: OutType[],
): LiteralMeta<OutType> => {
  const literalArray = t.keyof(constArray.reduce((r, k) => ({ ...r, [k]: null }), {} as Record<OutType, null>));

  const fromNumber = new t.Type<OutType, number, unknown>(
    `${typeName}FromNumber`,
    (inp: unknown): inp is OutType => literalArray.is(inp) || (isNum(inp) && inp > 0 && inp < constArray.length),
    (input, context) => {
      if (typeof input === 'string') return literalArray.validate(input, context);
      const r = isNum(input) ? numTo1BasedConst(constArray)(input) : null;
      return r === null ? t.failure(input, context, `invalid value for ${typeName}`) : t.success(r);
    },
    (out: OutType) => constArray.indexOf(out) + 1,
  );
  const literals = new t.Type<OutType, OutType, unknown>(typeName, fromNumber.is, fromNumber.validate, t.identity);

  return {
    values: constArray,
    guard: isInConstArray(constArray),
    fromNumber,
    literals,
    ord: ordFromLiterals(constArray),
  };
};
