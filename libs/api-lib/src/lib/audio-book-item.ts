import { type } from 'io-ts';
import { audioBookProps, childhoodAgeType } from '@becoming-german/model';

export const AudioBookItem = type({ ...audioBookProps, ageWhenImportant: childhoodAgeType.fromNumber });
