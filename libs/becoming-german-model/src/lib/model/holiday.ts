import * as t from 'io-ts';

export const Holiday = t.exact(t.type({ holidayActivities: t.string }));
