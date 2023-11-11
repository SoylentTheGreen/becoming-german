import * as t from 'io-ts';

export const Holiday = t.exact(t.type({ holidayActivities: t.string }));
export type Holidays = t.TypeOf<typeof Holiday>
