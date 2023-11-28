import { findDonatedProfileAggregateConfig } from './aggregate-event';
import { v4 as uuid} from 'uuid';
import * as t from 'io-ts';
import { ChildhoodProfile } from './childhood-profile';
import { isSome } from 'fp-ts/Option';

describe('desired behaviour', () => {
  const payloadC = t.partial(ChildhoodProfile.props);
  const aggregateId = uuid();
  const payload: t.TypeOf<typeof payloadC> = {bedroomSituation: 'sister'};
  const timestamp = Date.now();
  it('takes an incoming event and merges it with current event and build a new snapshot', () => {
    const event = {
      id: uuid(),
      aggregateId,
      type: 'UpdateProfile',
      aggregateType: 'DonatedProfile',
      aggregateVersion: 1,
      timestamp,
      payload,
    }
    const res = findDonatedProfileAggregateConfig(event);

    expect(isSome(res)).toBe(true);
    // aggregateBuilder.processEvent(payload)
    // --> payload -> parse event
    // --> does event have version number? (is new)
    // ----> validate incoming
    // ------> get snapshot / events
    // ----> generate version number (loop over validate if version came in between)
    // --> reduce event to next version
    // --> save snapshot if possible
  });

  it('takes a uuid and reads the latest version based on events and snapshots', () => {
    // select snapshot and events where event version id  >  snapshot
    // reduce outstanding events
    // produce Either<Partial<state>, state> from events.
    // update snapshot if outdated
  })
});
