import { UUID } from 'io-ts-types';

import { v4 as uuid } from 'uuid';
import { isRight } from 'fp-ts/Either';

describe('uuid', () => {
  it('checks a valid uuid', () => {
    expect(isRight(UUID.decode(uuid()))).toBe(true);
  });
});
