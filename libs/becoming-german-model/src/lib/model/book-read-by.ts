import { literalStringArrayTyping } from '@becoming-german/tools';

export const bookReadBys = ['readTo', 'self', 'half'];
export type BookReadBy = (typeof bookReadBys)[number];
export const bookReadByType = literalStringArrayTyping('BookReadBy', bookReadBys);
