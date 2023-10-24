import { ChildhoodProfile } from './childhood-profile';
import { decodeOrNull } from '../decode-or-null';



describe('ChildhoodProfile', () => {
  describe('decode', () => {
    const fromDecoder = decodeOrNull(ChildhoodProfile.decode);
    const validInput = {
      bedroomSituation: 'own',
       dwellingSituation: 'never',
      // gender: 'male',
      // moves: 'once',
      // parents: 'parents',
      siblingPosition: 'only',
      siblings: 'two',
      // state: undefined,
      birthDate: '2002-01-22',
    };

    const expectation = {...validInput, birthDate: new Date(2002, 0, 22, 1)};

    it('can be decoded from a valid json', () => {
      expect(fromDecoder(validInput)).toEqual(expectation);
    });
  });
});
