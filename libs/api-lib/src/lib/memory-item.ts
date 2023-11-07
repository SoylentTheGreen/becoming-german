import * as t from 'io-ts';
import { PersonItemTable } from './person-item-table';
import { DbSafeString } from './db-safe-string';

export const MemoryTable = t.intersection([PersonItemTable, t.type({ diverse: DbSafeString })]);
