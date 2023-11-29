import * as t from 'io-ts';
import { childhoodAgeType, songProps } from '@becoming-german/model';
import { PersonItemTable } from './person-item-table';

export const SongItem = t.type({ ...songProps, ageWhenImportant: childhoodAgeType.fromNumber });
export const SongTable = t.intersection([PersonItemTable, SongItem]);
