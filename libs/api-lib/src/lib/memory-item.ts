import * as t from 'io-ts';
import { PersonItemTable } from './person-item-table';
import { Memory } from '@becoming-german/model';


export const MemoryTable = t.intersection([PersonItemTable, Memory]);
