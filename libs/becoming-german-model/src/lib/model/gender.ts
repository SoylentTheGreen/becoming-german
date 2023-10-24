import { literalStringArrayTyping } from '@becoming-german/tools';

export const genders = ['male', 'female'] as const;
export type Gender = (typeof genders)[number];

export const genderType = literalStringArrayTyping<Gender>('Gender', [...genders]);






