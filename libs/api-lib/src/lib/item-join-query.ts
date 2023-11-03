import * as t from 'io-ts';
import { Item, languages } from '@becoming-german/model';
import { pipe } from 'fp-ts/function';
import { keys } from 'fp-ts/ReadonlyRecord';
import * as A from 'fp-ts/Array';
import { fMapping } from './field-mapping';



export const itemJoinQuery = <T extends t.Props>(i: Item, type: t.TypeC<T>) =>
  `json_object(${languages
    .map((l) => {
      return `'${l}', (CASE WHEN ${l}_${i}.id IS NULL THEN NULL ElSE  json_object(${pipe(
        type.props,
        keys,
        A.map((k) => fMapping(k, `${l}_${i}.${k}`)),
      ).join(',')}) END)`;
    })
    .join(',')})`;
