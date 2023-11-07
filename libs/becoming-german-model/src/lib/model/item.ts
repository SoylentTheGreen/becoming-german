import { literalStringArrayTyping } from '@becoming-german/tools';

export const items = ['book', 'grandparents', 'holidays', 'memory', 'song', 'party', 'speaking_book'] as const;
export type Item = (typeof items)[number];
export const itemsType = literalStringArrayTyping('Item', [...items]);

export const ItemToggleValue: Record<Item, number> = {
  book: 1,
  grandparents: 2,
  holidays: 4,
  memory: 8,
  party: 16,
  song: 32,
  speaking_book: 64,
};

