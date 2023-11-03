import { exact, type } from 'io-ts';
import { audioBookProps, childhoodAgeType } from '@becoming-german/model';

export const AudioBookItem = exact(type({ ...audioBookProps, ageWhenImportant: childhoodAgeType.fromNumber }));
