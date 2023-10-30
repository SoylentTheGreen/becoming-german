import { genderType } from './gender';
import { decodeOrNull } from '../decode-or-null';


describe('Gender', () => {
  describe('genderType', () => {
    describe('fromNumber', () => {
      const decoder = decodeOrNull(genderType.fromNumber);
      it('maps 1 to Gender male', () => {

        expect(decoder(1)).toBe('male');
      });

      it('maps 2 to Gender female', () => {
        expect(decoder(2)).toBe('female');
      });

      it('accepts Genders with no problem', () => {
        expect(decoder('male')).toBe('male');
        expect(decoder('female')).toBe('female');
      });



      it('it maps gives either left on invalid values', () => {
        expect(decoder(0)).toBeNull();
        expect(decoder('bla')).toBeNull();
        expect(decoder(-5)).toBeNull();
        expect(decoder(7)).toBeNull();
      });
    });
  });
});
