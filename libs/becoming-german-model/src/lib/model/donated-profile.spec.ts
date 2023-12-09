import { fromJS } from 'immutable';

describe('donated-profile', () => {
  it('validates that at least 1 item is set', () => {
    const a = {};
    const res = fromJS(a).setIn(['b', 'c', 'd'], 5);
    expect(res.toJS()).toEqual({b: {c: {d: 5}}});

  });
});
