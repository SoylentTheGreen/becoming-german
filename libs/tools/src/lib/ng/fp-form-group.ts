import * as t from 'io-ts';
import { flow, pipe } from 'fp-ts/function';
import { toEntries } from 'fp-ts/Record';
import * as A from 'fp-ts/Array';
import { FormControl, ValidatorFn } from '@angular/forms';
import * as E from 'fp-ts/Either';

const fpValidator: (codec: t.Mixed) => ValidatorFn = (c) =>
  flow(
    (ctl) => ctl.value,
    c.decode,
    E.fold(
      () => ({ invalid: true }),
      () => null,
    ),
  );

export const fpFormGroup = <T extends t.Props>(props: T): {[k in keyof T]: FormControl<t.TypeOf<T[k]> | null>} =>
  pipe(
    props,
    toEntries,
    A.reduce({} as {[k in keyof T]: FormControl<t.TypeOf<T[k]>>}, (r, [k, v]) => ({
      ...r,
      [k]: [null, [fpValidator(v)]],
    })),
  );
