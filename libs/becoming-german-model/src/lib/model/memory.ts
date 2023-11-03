import * as t from 'io-ts';

export const Memory = t.exact(
  t.type({
    diverse: t.string,
  }),
);
