import * as t from 'io-ts';
import { childhoodAgeType } from './childhood-age';

export const audioBookProps = {
  title: t.string,
  author: t.string,
  themeMusic: t.string,
  synopsis: t.string,
  reason: t.string,
  listeningSituation: t.string,
  ageWhenImportant: childhoodAgeType.literals,
};
export const AudioBook = t.type(audioBookProps);
export type AudioBook = t.TypeOf<typeof AudioBook>;
