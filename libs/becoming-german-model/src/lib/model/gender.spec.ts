import { genderType } from './gender';
import { decodeOrNull } from '../decode-or-null';

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
