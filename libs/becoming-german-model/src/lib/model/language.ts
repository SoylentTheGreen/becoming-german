import { literalStringArrayTyping } from '@becoming-german/tools';

export const languages = ['en', 'de'] as const;
export type Language = (typeof languages)[number];
export const languageType = literalStringArrayTyping<Language>('Language', [...languages]);
