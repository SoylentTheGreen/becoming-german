import { genderType } from './gender';
import { flow } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { Decode } from 'io-ts';

const decodeOrNull = <T>(decoder: Decode<unknown, T>) =>
  flow(
    decoder,
    E.fold(
      () => null,
      (v) => v,
    ),
  );

describe('Gender', () => {
  describe('genderType', () => {
    describe('fromNumber', () => {
      const fromNum = decodeOrNull(genderType.fromNumber.decode);
      it('maps 1 to Gender male', () => {
        expect(fromNum(1)).toBe('male');
      });

      it('maps 2 to Gender female', () => {
        expect(fromNum(2)).toBe('female');
      });

      it('it maps gives either left on invalid values', () => {
        expect(fromNum(0)).toBeNull();
        expect(fromNum('bla')).toBeNull();
        expect(fromNum(-5)).toBeNull();
        expect(fromNum(7)).toBeNull();
      });
    });
  });
});
