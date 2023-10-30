import { decodeOrNull } from '../decode-or-null';
import { DateOnlyInput } from './date-only-input';

describe('DateOnlyInput', () => {
  const ut = decodeOrNull(DateOnlyInput);
  describe('decode', () => {
    describe('valid input', () => {
      const expectation = new Date(1972, 0, 31, 12, 0, 0);
      const testValid = (inp: Date | string | number) => () =>
        expect(ut(inp)?.toISOString()).toBe(expectation.toISOString());
      it('accepts date object', testValid(new Date('1972-01-31T10:13:01.003Z')));
      it('accepts date object', testValid('1972-01-31T10:13:01.003Z'));
      it('accepts date object', testValid('1972-01-31'));
      it('accepts date object', testValid(expectation.valueOf()));
    });
  });
});
