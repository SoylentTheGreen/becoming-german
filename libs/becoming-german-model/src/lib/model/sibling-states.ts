import { literalStringArrayTyping } from '@becoming-german/tools';


export const siblings = ['none', 'one', 'two', 'three', 'four', 'five', 'more'] as const;

export type SiblingState = (typeof siblings)[number];
export const siblingStateType = literalStringArrayTyping<SiblingState>('SiblingState', [...siblings]);
