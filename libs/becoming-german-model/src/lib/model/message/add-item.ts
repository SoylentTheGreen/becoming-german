import { Language } from '../language';

export type AddItem<T, K extends keyof T & string> = {
  language: Language;
  type: K;
  item: T[K];
};
