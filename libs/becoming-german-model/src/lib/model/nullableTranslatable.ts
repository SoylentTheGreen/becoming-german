import * as t from 'io-ts';
import { Language, languageType } from './language';

export type Translatable<T> = Record<Language, T | null>

export const TranslatableC = <T extends t.Mixed>(codec: T): t.Type<Translatable<t.TypeOf<T>>> =>
  t.record(languageType.literals, t.union([codec, t.null]));


export type NullableTranslatable<T> = null | Record<Language, T | null>

export const NullableTranslatableC = <T extends t.Mixed>(codec: T): t.Type<NullableTranslatable<t.TypeOf<T>>> =>
  t.union([t.null, t.record(languageType.literals, t.union([codec, t.null]))]);

