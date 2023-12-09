import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, mergeMap, Observable, shareReplay, tap } from 'rxjs';
import * as A from 'fp-ts/Array';
import {
  AggregateEvent,
  Childhood,
  ChildhoodAggregate,
  ChildhoodC,
  ChildhoodSituation,
  ChildhoodSituationC,
  DonatedProfileC,
  MatchingItems,
  MatchingItemsC,
  MatchingProfileRequest,
  MatchingProfileRequestC,
  QueryResponse,
} from '@becoming-german/model';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { fromEither, isSome, none, Option, Some, some } from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import * as R from 'fp-ts/Record';
import { Empty } from '@angular-devkit/core/src/virtual-fs/host';
import { ProfileCreated } from 'libs/becoming-german-model/src/lib/model/childhood-aggregate';

const decodeResultToOption =
  <T, O>(codec: t.Type<T, O>) =>
  (inp: unknown): Option<T> => {
    const v = codec.decode(inp);
    if (E.isRight(v)) return some(v.right);

    console.log('error mapping person from server', inp);
    return none;
  };

export type Nullable<T> = { [K in keyof T]: T[K] | null };
const getValue = <T>(i: Some<T>) => i.value;
const emptyReq =  pipe(
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

  profileInput: Observable<Nullable<MatchingProfileRequest>> = this.matchingProfileInput.pipe(shareReplay(1));

  requestProfile = this.matchingProfileInput.pipe(
    map(flow(MatchingProfileRequestC.decode)),
    filter(E.isRight),
    map(e => e.right),
  );

  spendenProfile = this.matchingProfileInput.pipe(
    map(ChildhoodSituationC.decode),
    filter(E.isRight),
    map(r => r.right),
  );

  matchingProfile: Observable<MatchingItems> = this.requestProfile.pipe(
    tap(console.log),
    mergeMap((req) => {
      console.log(`we are about to make a request with ${req}`);
      return this.http.post('/api/request', req)
    }),
    map(MatchingItemsC.decode),
    filter(E.isRight),
    map(r => r.right),
  );


  currentProfile = this.matchingProfile.pipe(shareReplay(1));
  constructor(private http: HttpClient) {}

  findProfile(req: Nullable<MatchingProfileRequest>) {
    this.matchingProfileInput.next(req);
  }

  resetInput() {
    this.matchingProfileInput.next(emptyReq)
  }

  addProfile(cp: ChildhoodSituation) {
    return this.http.post<ProfileCreated>('/api/donate', cp);
  }
}
