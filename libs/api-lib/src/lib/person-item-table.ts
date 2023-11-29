import * as t from 'io-ts';

export const PersonItemTable = t.type({
  id: t.number,
  pid: t.number,
});
export type PersonItemTable = t.TypeOf<typeof PersonItemTable>;
