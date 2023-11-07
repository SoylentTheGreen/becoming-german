import * as t from 'io-ts';
import { escape as mysqlEscape } from 'mysql2';

export const DbSafeString = new t.Type('mysqlsafestring', t.string.is, t.string.validate, mysqlEscape);
