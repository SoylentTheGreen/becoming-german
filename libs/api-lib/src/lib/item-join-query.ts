import * as t from 'io-ts';
import { Item } from '@becoming-german/model';
import { pipe } from 'fp-ts/function';
import { keys } from 'fp-ts/ReadonlyRecord';
import * as A from 'fp-ts/Array';
import { fMapping } from './field-mapping';



export const itemJoinQuery = <T extends t.Props>(item: Item, type: t.TypeC<T>) => {

  return `json_object(${pipe(
    type.props,
    keys,
    A.map((k) => fMapping(k, `${k}`)),
  ).join(',')})`;
};
