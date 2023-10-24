import { Decode } from "io-ts";
import { flow } from "fp-ts/function";
import * as E from "fp-ts/Either";

export const decodeOrNull = <T>(decoder: Decode<unknown, T>) =>
  flow(
    decoder,
    E.fold(
      () => null,
      (v) => v
    )
  );
