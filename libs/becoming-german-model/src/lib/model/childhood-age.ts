import { literalStringArrayTyping } from '@becoming-german/tools';

export const childhoodAges = ['<5', '5-6', '7-8', '9-10', '10-11', '12-13', '>13'] as const;
export type ChildhoodAge = (typeof childhoodAges)[number];
export const childhoodAgeType = literalStringArrayTyping('ChildhoodAge', [...childhoodAges]);
