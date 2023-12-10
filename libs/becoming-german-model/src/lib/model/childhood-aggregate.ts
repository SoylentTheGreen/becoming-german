import * as S from 'fp-ts/State';
import { AggregateEvent } from './event';
import * as t from 'io-ts';
import { Validation } from 'io-ts';
import * as E from 'fp-ts/Either';
import * as R from 'fp-ts/Record';
import { ChildhoodSituationC } from './childhood-situation';
import {
  Childhood,
  ChildhoodC,
  ChildhoodProfile,
  childhoodProfileProps,
  DonatedProfile,
  DonatedProfileC,
} from './donated-profile';
import { flow, identity, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { v4 as uuid } from 'uuid';
import { UUID } from 'io-ts-types';
import { languageType } from './language';
import { fromJS } from 'immutable';
import { AggregateState } from './event/aggregate-state';

//list of operations
/**
 * 1. MigrateProfile ProfileMigrated<Childhood<Country>>
 * 2. DonatedSituation <Childhood>
 * 3. AddItem <>
 *   //Here we have a valid Childhood
 * 5. SnapShotCreated
 * 4. UpdateSituation
 * 5. UpdateItem
 * 6. AddItemTranslation
 */

export const itemAddedPayloadC = t.refinement(
  t.type({
    id: UUID,
    type: t.keyof(childhoodProfileProps),
    language: languageType.literals,
    item: t.union([t.string, t.null, ...Object.values(childhoodProfileProps)]),
  }),
  (v) => E.isRight(childhoodProfileProps[v.type].decode(v.item) as Validation<unknown>),
  'ItemAddedPayload',
);
const ChildhoodEvents = {
  'profile-migrated': DonatedProfileC,
  'profile-created': DonatedProfileC,
  'item-added': itemAddedPayloadC,
  // 'snapshot-created': ChildhoodC,
  // 'situation-updated': ChildhoodSituationC,
  // 'item-updated': itemAddedC,
  // 'profile-translated': t.type({ language: languageType.literals, profile: ChildhoodProfileC }),
};

export type ChildhoodEventType = keyof typeof ChildhoodEvents;

const ChildhoodEventC = <T extends t.Mixed>(key: ChildhoodEventType, payload: T) =>
  t.type({
    id: UUID,
    type: t.literal(key),
    aggregateType: t.literal(ChildhoodC.name),
    aggregateId: UUID,
    aggregateVersion: t.number,
    payload,
    timestamp: t.number,
  });

const profileCreatedC = ChildhoodEventC('profile-created', DonatedProfileC);
export type ProfileCreated = t.TypeOf<typeof profileCreatedC> & AggregateEvent;

const profileMigratedC = ChildhoodEventC('profile-migrated', t.type({ legacyId: t.number, state: ChildhoodC }));
export type ProfileMigrated = t.TypeOf<typeof profileMigratedC> & AggregateEvent;

const itemAddedC = ChildhoodEventC('item-added', itemAddedPayloadC);
export type ItemAdded = t.TypeOf<typeof itemAddedC>;

export type ChildhoodEvent = t.TypeOf<typeof profileCreatedC | typeof profileMigratedC | typeof itemAddedC>;

const makeEvent = <T>(
  type: ChildhoodEventType,
  payload: T,
  aggregateId: string,
  aggregateVersion: number,
): AggregateEvent => ({
  id: uuid(),
  type,
  aggregateType: ChildhoodC.name,
  aggregateId: aggregateId,
  aggregateVersion,
  payload,
  timestamp: Date.now(),
});
export type ChildhoodState = E.Either<AggregateState<unknown>, AggregateState<Childhood>>;
export type StateReturn = [O.Option<ChildhoodEvent>, ChildhoodState];
type ChildhoodSituationOut = t.OutputOf<typeof ChildhoodSituationC>;

const emptyProfile: (id: string, situation: ChildhoodSituationOut) => t.OutputOf<typeof ChildhoodC> = (
  id,
  situation,
) => ({
  id,
  legacyId: null,
  situation,
  profile: { de: emptyChildhoodProfile, en: emptyChildhoodProfile },
});
export type StateMapper = S.State<ChildhoodState, O.Option<ChildhoodEvent>>;
const unchanged =
  () =>
  (s: ChildhoodState): StateReturn => [O.none, s];

const profileCreatedEventBuilder = flow(
  ChildhoodSituationC.decode,
  E.map((p) => emptyProfile(uuid(), ChildhoodSituationC.encode(p))),
  E.chain(flow((payload) => makeEvent('profile-created', payload, payload.id, 1), profileCreatedC.decode)),
  O.fromEither,
);

const itemAddedEventBuilder = (previousVersion: number) => (payload: unknown) =>
  pipe(
    payload,
    itemAddedPayloadC.decode,
    E.chain(flow((payload) => makeEvent('item-added', payload, payload.id, previousVersion), itemAddedC.decode)),
    O.fromEither,
  );

const profileCreatedStateMapper =
  (event: ProfileCreated): StateMapper =>
  () => [O.some(event), E.left({ version: 1, state: event.payload })];

const profileMigratedStateMapper =
  (event: ProfileMigrated): StateMapper =>
  () => [O.some(event), E.left({ version: 1, state: event.payload.state })];

const itemAddedStateMapper =
  (event: ItemAdded): StateMapper =>
  (s) => {
    const arrgghhh: O.Option<DonatedProfile> = pipe(
      s,
      E.toUnion,
      (acc: AggregateState<unknown>) => {
        if (acc.version + 1 !== event.aggregateVersion) return O.none;
        return O.some(acc)
      },
      O.chain((acc) =>
        pipe(
          fromJS(acc.state).setIn(['profile', event.payload.language, event.payload.type], event.payload.item).toJS(),
          DonatedProfileC.decode,
          O.fromEither,
        ),
      ),
    );
    if (O.isNone(arrgghhh)) return [O.none, s];
    const newV = <T>(state: T): AggregateState<T> => ({ version: event.aggregateVersion, state });

    return [
      O.some(event),
      pipe(
        ChildhoodC.decode(arrgghhh.value),
        E.mapLeft(() => newV<unknown>(arrgghhh.value)),
        E.map(newV),
      ),
    ];
  };
const emptyChildhoodProfile: ChildhoodProfile = {
  memory: null,
  book: null,
  grandparents: null,
  holidays: null,
  party: null,
  song: null,
  audioBook: null,
  hobby: null,
  favoriteColor: null,
  hatedFood: null,
  dwellingSituationComment: null,
  softToy: null,
};

const eventCodecs: Record<ChildhoodEventType, (e: unknown) => O.Option<StateMapper>> = {
  'profile-created': flow(profileCreatedC.decode, O.fromEither, O.map(profileCreatedStateMapper)),
  'profile-migrated': flow(profileMigratedC.decode, O.fromEither, O.map(profileMigratedStateMapper)),
  'item-added': flow(itemAddedC.decode, O.fromEither, O.map(itemAddedStateMapper)),
};

export const getStateMapper = (event: { type: string }): StateMapper =>
  pipe(
    eventCodecs,
    R.lookup(event.type),
    O.chain((f) => f(event)),
    O.getOrElse(unchanged),
  );
export const create = (p: unknown) =>
  pipe(p, profileCreatedEventBuilder, O.map(profileCreatedStateMapper), O.fold(unchanged, identity));

export const addItem = (version: number) => (payload: unknown) =>
  pipe(itemAddedEventBuilder(version)(payload), O.map(itemAddedStateMapper), O.fold(unchanged, identity));

export const build = (events: AggregateEvent[]) => pipe(events.map(getStateMapper), S.sequenceArray);
export const nextEvent = flow(getStateMapper)

export const fromEvents = (events: ChildhoodEvent[]) =>
  pipe(E.left({ version: 0, state: null }), build(events), (r) => r[1]);
export const newState: ChildhoodState = E.left({ version: 0, state: null });
export const begin = S.of([O.none, newState]);
