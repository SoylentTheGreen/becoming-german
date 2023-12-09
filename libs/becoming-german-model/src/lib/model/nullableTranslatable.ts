import * as t from 'io-ts';
import { Language, languageType } from './language';

export type Translatable<T> = Record<Language, T | null>

export const TranslatableC = <T extends t.Mixed>(codec: T): t.Type<Translatable<t.TypeOf<T>>> =>
  t.record(languageType.literals, codec);


export type NullableTranslatable<T> = Record<Language, T | null>

export const NullableTranslatableC = <T, O = T>(codec: t.Type<T, O>): t.Type<NullableTranslatable<T>, NullableTranslatable<O>> =>
  t.record(languageType.literals, t.union([codec, t.null]));

