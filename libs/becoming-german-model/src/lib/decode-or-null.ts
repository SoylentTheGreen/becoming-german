import { Type } from 'io-ts';
import { flow } from "fp-ts/function";
import * as E from "fp-ts/Either";


export const decodeOrNull = <A, O, I>(codec: Type<A, O, I>) =>
  flow(
    codec.decode,
    E.fold(
      () => null,
      (v) => v
    )
  );
