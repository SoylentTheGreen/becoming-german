import { ChildhoodProfile } from '@becoming-german/model';
import { decodeOrNull } from '@becoming-german/model';
import { PathReporter } from 'io-ts/PathReporter';

import * as t from 'io-ts';
import { ChildhoodProfileTable } from './childhood-profile-table';

const test = t.keyof({ a: null, b: null });
type Test = t.TypeOf<typeof test>;
const fromNumber = new t.Type<Test, number, unknown>(
  `TestNumber`,
  test.is,
  (input, context) =>
    input === 1 ? t.success('a') : input === 2 ? t.success('b') : t.failure(input, context, 'must be 1 or 2'),
  (out: Test) => (out === 'a' ? 1 : 2),
);

const T1 = t.type({ a: fromNumber, b: t.string });
const T2 = t.type({ a: test, b: t.string });
type T1 = t.TypeOf<typeof T1>;
type T2 = t.TypeOf<typeof T2>;
const testy: T2 = { a: 'a', b: 'test' };
type ChildhoodProfileTable = t.TypeOf<typeof ChildhoodProfileTable>;
describe('PersonTable', () => {
  it('can map from a valid profile to ChildhoodProfileTable', () => {
    const profile: ChildhoodProfile = {
      bedroomSituation: 'own',
      birthDate: new Date('1973-10-10'),
      dwellingSituation: 'suburb',
      gender: 'male',
      germanState: 'NW',
      moves: '1',
      parents: 'parents',
      siblingPosition: 'youngest',
      siblings: 'two',
    };

    const ut = ChildhoodProfileTable.encode(profile);
    expect(ut).toEqual({
      bedroomSituation: 1,
      birthDate: new Date(),
      dwellingSituation: 2,
      gender: 1,
      moves: 1,
      parents: 1,
      siblingPosition: 4,
      siblings: 2,
    });
  });
});
