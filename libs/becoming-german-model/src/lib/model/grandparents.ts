import * as t from 'io-ts';

export const Grandparents = t.exact(
  t.type({
    who: t.string,
    didYouMeet: t.string,
    getOn: t.string,
    activity: t.string,
    smell: t.string,
    association: t.string,
    specialMemory: t.string,
  }),
);
export type Grandparents = t.TypeOf<typeof Grandparents>
