import * as t from 'io-ts';
import { PersonItemTable } from './person-item-table';
import { Grandparents } from '../../../becoming-german-model/src/lib/model/grandparents';

export const grandparentsTable = t.intersection([PersonItemTable, Grandparents]);
