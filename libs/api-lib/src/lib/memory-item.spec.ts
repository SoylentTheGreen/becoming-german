import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { MemoryTable } from './memory-item';
import { Memory } from '@becoming-german/model';

describe('mapping io-ts types', () => {
  it('chains 2 decodes into single output', () => {
    const input = { id: 1, pid: 1, diverse: 'a string' };
    const res = pipe(input, MemoryTable.decode, E.chain(Memory.decode));
    expect(E.isRight(res) && res.right.diverse).toBe(input.diverse);
  });
});
