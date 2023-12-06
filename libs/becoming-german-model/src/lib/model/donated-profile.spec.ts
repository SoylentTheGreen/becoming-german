import { ChildhoodProfile } from './childhood-profile';
import { isRight } from 'fp-ts/Either';
import { DonatedProfileC, SearchableProfileC } from './donated-profile';
import { v4 as uuid } from 'uuid';
import { PathReporter } from 'io-ts/PathReporter';
import { itemPropsRaw } from './item';
import { pipe } from 'fp-ts/function';
import { reduce as Areduce } from 'fp-ts/Array';
import { fromEntries, toEntries } from 'fp-ts/Record';

describe('donated-profile', () => {
  it('validates that at least 1 item is set', () => {
    const testData = {
      birthYear: 1970,
      gender: 'female',
      parents: 'mother',
      siblings: 'two',
      siblingPosition: 'middle',
      bedroomSituation: 'brother',
      dwellingSituation: 'small_town',
      dwellingSituationComment: null,
      moves: '2',
      hobby: { de: '' },
      favoriteColor: { de: 'asdfa' },
      germanState: 'NW',
    };
    const validCH = { ...testData, ...{ hobby: { de: 'not empty' } } };
    expect(isRight(ChildhoodProfile.decode(testData))).toBe(false);
    expect(isRight(ChildhoodProfile.decode(validCH))).toBe(true);

    expect(isRight(DonatedProfileC.decode({ ...testData, id: uuid() }))).toBe(false);

    const validProfile = {
      ...validCH,
      ...pipe(
        itemPropsRaw,
        toEntries,
        Areduce({}, (r, [k]) => ({ ...r, [k]: null })),
      ),
    };

    expect(isRight(DonatedProfileC.decode(validProfile))).toBe(true);

    const searchableProfile = { ...validProfile, memory: { de: { diverse: 'test' } }, id: uuid() };

    expect(isRight(SearchableProfileC.decode(searchableProfile))).toBe(true);
  });
});
