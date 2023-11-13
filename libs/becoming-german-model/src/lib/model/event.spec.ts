import * as t from 'io-ts';
import { creationEventFactory } from './event';
import { isRight } from 'fp-ts/Either';
import { UUID } from 'io-ts-types';
import { v4 as uuid } from 'uuid';
import { decodeOrNull } from '../decode-or-null';

describe('Event Factory', () => {
  it('can generate an event factory for an ios type', () => {
    expect((new Date(2001, 1, 1, 12, 1, 1, 123).toISOString())).toBe('2001-02-01T11:01:01.123Z');

    // expect(isRight(UUID.decode(uuid().toString()))).toBe(true);
    // const dtype = t.type({ name: t.string, id: t.number });
    // const ut = eventFactory(dtype, typeString);
    // const test = decodeOrNull()
    // const t
    // const ev = ut(, );
    //
    // expect(isRight(ev)).toBe(true);
    // expect()
  });
});
