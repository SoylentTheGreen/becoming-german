import * as t from 'io-ts';
import { isRight } from 'fp-ts/Either';
import { PathReporter } from 'io-ts/PathReporter';
import { BookItem } from './book-item';
import { Memory, NullableTranslatableC } from '@becoming-german/model';

type BookTableOut = t.OutputOf<typeof BookItem>;
describe('mapping', () => {
  it('can map a book', () => {
    const raw: BookTableOut = {
      title: 'die unendliche geschichte',
      author: 'michael ende',
      readBy: 2,
      synopsis: '',
      character1: '',
      character2: '',
      ageWhenRead: 5,
      whyFavorite: 'es war das einzige das ich fertig gelesen hab',
      howItInfluenced: 'nicht wirklich',
    };
    const res = BookItem.decode(raw);
    console.log(PathReporter.report(res));
    expect(isRight(res)).toBe(true);
  });

  it('can resolve the type of Translated', () => {
    const example = NullableTranslatableC(Memory);

    const e: t.TypeOf<typeof example> = {de: {diverse: 'test'}};
  })
});
