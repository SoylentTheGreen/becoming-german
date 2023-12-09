import * as t from 'io-ts';
import * as S from 'fp-ts/State';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';



type PropertyUpdate<T, K extends keyof T> = { propName: K; propValue: T[K] };


const getAct = <T, K extends keyof T>(propName: K, propValue: T[K]): PropertyUpdate<T, K> => ({
  propName,
  propValue,
});

const setProp = <T>(update: PropertyUpdate<T, keyof T>) => (s: T): T =>
    Object.assign({}, s, { [update.propName]: update.propValue });



const events: PropertyUpdate<TestAggregate, keyof TestAggregate>[] = [
  getAct('id', 10),
  getAct('name', 'testing'),
  getAct('name', 'testing2'),
  getAct('name', 'testing4'),
  getAct('name', 'testing1'),
];

describe('desired behaviour', () => {
  const assertRight = <L, R>(r: E.Either<L, R>): r is E.Right<R> => {
    const right = E.isRight(r);
    expect(right).toBe(true);
    return right;
  };
  it('combines events to produce a valid object and list of events', () => {
    const actions = events.map();
    const [validEvents, finalState] = S.sequenceArray(actions)(E.left(null));

    expect(validEvents.filter(O.isSome).length).toBe(5);
    if (assertRight(finalState)) {
      expect(finalState.right.name).toBe(events[4].propValue);
      expect(finalState.right.id).toBe(events[0].propValue);
    }
  });
});
