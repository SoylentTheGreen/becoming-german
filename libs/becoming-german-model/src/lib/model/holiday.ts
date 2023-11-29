import * as t from 'io-ts';

export const Holiday = t.type({ holidayActivities: t.string });
export type Holidays = t.TypeOf<typeof Holiday>
