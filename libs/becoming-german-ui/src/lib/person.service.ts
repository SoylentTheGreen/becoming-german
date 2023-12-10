import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  filter,
  firstValueFrom,
  map,
  mergeMap,
  Observable,
  scan,
  shareReplay,
  Subject,
  tap,
} from 'rxjs';
import * as A from 'fp-ts/Array';
import {
  AddItem,
  AggregateEvent,
  AggregateState,
  Childhood,
  ChildhoodAggregate,
  ChildhoodC,
  ChildhoodProfile,
  ChildhoodSituation,
  ChildhoodSituationC,
  MatchingItems,
  MatchingItemsC,
  MatchingProfileRequest,
  MatchingProfileRequestC,
  QueryResponse,
} from '@becoming-german/model';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { none, Option, some } from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import * as R from 'fp-ts/Record';
import * as TE from 'fp-ts/TaskEither';
import { mapOneOrManyArgs } from 'rxjs/internal/util/mapOneOrManyArgs';

const decodeResultToOption =
  <T, O>(codec: t.Type<T, O>) =>
  (inp: unknown): Option<T> => {
    const v = codec.decode(inp);
    if (E.isRight(v)) return some(v.right);

    console.log('error mapping person from server', inp);
    return none;
  };

export type Nullable<T> = { [K in keyof T]: T[K] | null };

const emptyReq = pipe(
  MatchingProfileRequestC.props,
  R.map(() => null),
);

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  people: Observable<Childhood[]> = this.http.get<QueryResponse<unknown>>('/api/admin/profiles/0/50').pipe(
    map((v) => v.result),
    map(flow(A.map(decodeResultToOption(ChildhoodC)), A.compact)),
    shareReplay(1),
  );

  private matchingProfileInput = new BehaviorSubject<Nullable<MatchingProfileRequest>>(emptyReq);
  private donateProfileInput = new Subject<AggregateEvent>();
  profileInput: Observable<Nullable<MatchingProfileRequest>> = this.matchingProfileInput.pipe(shareReplay(1));
  donation = this.donateProfileInput.pipe(
    scan((events, ev) => [...events, ev], [] as AggregateEvent[]),
    map(ChildhoodAggregate.build),
    map((c) => c(ChildhoodAggregate.newState)),
    map((r) => r[1]),
    // map(
    //   flow(
    //     E.mapLeft((l) => l.state),
    //     E.map((r) => r.state),
    //   ),
    // ),
    shareReplay(1),
  );


  requestProfile = this.matchingProfileInput.pipe(
    map(flow(MatchingProfileRequestC.decode)),
    filter(E.isRight),
    map((e) => e.right),
  );

  spendenProfile = this.matchingProfileInput.pipe(
    map(ChildhoodSituationC.decode),
    filter(E.isRight),
    map((r) => r.right),
  );

  matchingProfile: Observable<MatchingItems> = this.requestProfile.pipe(
    mergeMap((req) => this.http.post('/api/request', req)),
    map(MatchingItemsC.decode),
    filter(E.isRight),
    map((r) => r.right),
  );

  currentProfile = this.matchingProfile.pipe(shareReplay(1));

  constructor(private http: HttpClient) {}

  findProfile(req: Nullable<MatchingProfileRequest>) {
    this.matchingProfileInput.next(req);
  }

  resetInput() {
    this.matchingProfileInput.next(emptyReq);
  }

  async addProfile(cp: ChildhoodSituation) {
    const result = await firstValueFrom(this.http.post<ChildhoodAggregate.ProfileCreated>('/api/donate', cp));
    this.donateProfileInput.next(result);
    return result;
  }

  private _addItem<T, K extends keyof T & string>(
    id: string,
    req: AddItem<T, K>,
  ): TE.TaskEither<Error, ChildhoodAggregate.ItemAdded> {
    return TE.tryCatch(
      () => firstValueFrom(
        this.http.post<ChildhoodAggregate.ItemAdded>(`/api/${id}/addItem`, req).pipe(
          tap((v) => this.donateProfileInput.next(v))
        )
      ),
      (e) => (e instanceof Error ? e : new Error('error retrieving ')),
    );
  }

  addItem<K extends keyof ChildhoodProfile>(type: K, item: ChildhoodProfile[K]) {
    const hasId = (v: unknown): v is { id: string | null } => Object.prototype.hasOwnProperty.call(v, 'id');
    return pipe(
      TE.tryCatch(
        () => firstValueFrom(this.donation.pipe(map(E.toUnion))),
        (e) => (e instanceof Error ? e : new Error('error retrieving ')),
      ),
      TE.chain((s: AggregateState<unknown>) =>
        hasId(s.state) && !!s.state.id ? TE.right({ id: s.state.id, item, type }) : TE.left(new Error('no id')),
      ),
      TE.chain((s) => this._addItem(s.id, { ...s, language: 'de' })),
    );
  }
}
