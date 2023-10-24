import { isInConstArray, numTo1BasedConst } from './index';
import * as t from 'io-ts';
import { fromCompare, Ord } from "fp-ts/Ord";

const isNum = (i: unknown): i is number => Number.isInteger(i);

export type LiteralMeta<T extends string> = {
  values: T[],
  guard: (a: unknown) => a is T,
  fromNumber: t.Type<T, number>,
  literals: t.KeyofType<Record<T, null>>,
  ord: Ord<T>
}

export const literalStringArrayTyping = <OutType extends string>(typeName: string, constArray: OutType[]): LiteralMeta<OutType> => {
  const literals = t.keyof(constArray.reduce((r, k) => ({ ...r, [k]: null }), {} as Record<OutType, null>));
  const ord: Ord<OutType> = fromCompare((a, b) => {
    const idxA = constArray.indexOf(a);
    const idxB = constArray.indexOf(b);
    if(idxA === idxB) return 0;
    return idxA > idxB ? 1 : -1;
  })
  const fromNumber = new t.Type<OutType, number, unknown>(
    `${typeName}FromNumber` ,
    literals.is,
    (input, context) => {
      const r = isNum(input) ? numTo1BasedConst(constArray)(input) : null;
      return r === null ? t.failure(input, context, `invalid index ${input} on ${typeName}`) : t.success(r);
    },
    (out: OutType) => constArray.indexOf(out),
  );
  return {
    values: constArray,
    guard: isInConstArray(constArray),
    fromNumber,
    literals,
    ord
  };
};
