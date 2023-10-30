import { ChildhoodProfile } from './childhood-profile';
import { decodeOrNull } from '../decode-or-null';
import { fold, isLeft, isRight } from 'fp-ts/Either';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';

describe('ChildhoodProfile', () => {
  describe('decode', () => {
    const fromDecoder = decodeOrNull(ChildhoodProfile);
    const validInput = {
      bedroomSituation: 'own',
      dwellingSituation: 'town',
      gender: 'male',
      moves: '1',
      parents: 1,
      siblingPosition: 'only',
      siblings: 'two',
      germanState: 'HH',
      birthDate: '2002-01-22',
    };

    const expectation = { ...validInput, parents: 'parents', birthDate: new Date(2002, 0, 22, 12) };

    it('can be decoded from a valid json', () => {
      expect(fromDecoder(validInput)).toEqual(expectation);
    });

    /** Helper function returns the field name from the ValidationError */
    function validationErrorKey<T>(error: t.ValidationError) {
      // Assumes the first non-empty key is the field name
      return error.context.find((c) => c.key.length > 0)!.key as keyof T;
    }

    // type FieldErrors<T> = Partial<Record<keyof T, string>>;

    /** Creates an empty FieldErrors object for the specified entity type. */
    // const FieldErrors = <T = Record<string, any>>() => {};
    type Res<T> = { errors: [keyof T, unknown][]; result: T | null };
    const validate = <T extends object>(r: t.Validation<T>): Res<T> => {
      return pipe(
        r,
        fold(
          (e: t.Errors) => ({
            errors: e.map((er) => [validationErrorKey<T>(er), er.message] as [keyof T, unknown]),
            result: null,
          }),
          (result: T): Res<T> => ({
            errors: [],
            result,
          }),
        ),
      );
    };

    it('can extract individual errors', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { parents: _, ...falseInp } = { ...validInput, parents: 0 };

      const result = validate(ChildhoodProfile.decode(falseInp));
      expect(result.errors.length).toBe(1);
      expect(result.errors[0][0]).toBe('parents');
      expect(result.errors[0][1]).toBe('what');
    });
  });
});
