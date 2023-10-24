import { literalStringArrayTyping } from '@becoming-german/tools';

const homeMoves = ['0', '1', '2', '2+'] as const;
export type HomeMoves = (typeof homeMoves)[number];


export const homeMovesType = literalStringArrayTyping<HomeMoves>('HomeMoves', [...homeMoves]);
