import * as CA from './childhood-aggregate';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';

export const assertRight = <T>(i: E.Either<unknown, T>): i is E.Right<T> => {
  expect(E.isRight(i)).toBe(true);
  return true;
};
export const assertLeft = <T>(i: E.Either<T, unknown>): i is E.Left<T> => {
  expect(E.isLeft(i)).toBe(true);
  return true;
};
export const assertSome = <T>(i: O.Option<T>): i is O.Some<T> => {
  expect(O.isSome(i)).toBe(true);
  return true;
};

describe('ChildhoodAggregate', () => {
  describe('create', () => {
    const testData = {
      bedroomSituation : 'own',
      dwellingSituation: 'city',
      gender           : 'diverse',
      germanState      : 'BB',
      moves            : '0',
      parents          : 'parents',
      siblingPosition  : 'only',
      siblings         : 'none',
      birthDate        : '1974-01-07',
    };
    it('produces an aggregate state with valid data', () => {
      const ut = CA.create(testData);
      const result = ut(E.left({ version: 0, state: null }));
      const event = result[0];
      const state = result[1];
      expect(O.isSome(event)).toBe(true);
      if (!assertLeft(state)) return;
      if(!O.isSome(event)) return;
      const agg = state.left;
      expect(agg.version).toBe(1);
      const toTest = Object.assign({}, {id: null}, agg.state);

      expect(agg.state).toEqual(toTest);
      expect(event.value.payload).toEqual(toTest);
      expect(CA.build([event.value])(E.left({ version: 0, state: null }))).toEqual([[result[0]], result[1]]);
      const addItemEvent = CA.addItem(event.value.aggregateVersion + 1)({
        id: event.value.aggregateId,
        language: 'de',
        type: 'memory',
        item: 'This is the memory'
      })(result[1]);

      if(!assertRight(addItemEvent[1])) return;
      if(!assertSome(addItemEvent[0])) return;
      expect(addItemEvent[0].value).toEqual({
        aggregateId: event.value.aggregateId,
        id: expect.any(String),
        aggregateType: 'Childhood',
        aggregateVersion: 2,
        type: 'item-added',
        timestamp: expect.any(Number),
        payload: {
          id: event.value.aggregateId,
          language: 'de',
          type: 'memory',
          item: 'This is the memory',
        }
      });
      expect(addItemEvent[1].right.state.profile.de?.memory).toBe('This is the memory');

    });


  });
});
