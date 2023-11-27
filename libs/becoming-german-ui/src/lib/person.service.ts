import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, mergeMap, Observable, shareReplay } from 'rxjs';
import * as A from 'fp-ts/Array';
import {
  ChildhoodProfile,
  ChildhoodProfileOutput,
  MatchingItems,
  MatchingItemsC,
  Person,
  QueryResponse,
} from '@becoming-german/model';
import { flow, pipe } from 'fp-ts/function';
import { Type } from 'io-ts';
import { fromEither, isSome, none, Option, Some, some } from 'fp-ts/Option';
import { isRight } from 'fp-ts/Either';
import * as R from 'fp-ts/Record';

const decodeResultToOption =
  <T, O>(codec: Type<T, O>) =>
  (inp: unknown): Option<T> => {
    const v = codec.decode(inp);
    if (isRight(v)) return some(v.right);

    console.log('error mapping person from server', inp);
    return none;
  };

export type Nullable<T> = { [K in keyof T]: T[K] | null };
const getValue = <T>(i: Some<T>) => i.value;

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  people: Observable<Person[]> = this.http.get<QueryResponse<unknown>>('/api/admin/profiles/0/50').pipe(
    map((v) => v.result),
    map(flow(A.map(decodeResultToOption(Person)), A.compact)),
    shareReplay(1),
  );

  private matchingProfileInput = new BehaviorSubject<Nullable<ChildhoodProfileOutput>>(
    pipe(
      ChildhoodProfile.type.props,
      R.map(() => null),
    ),
  );

  profileInput: Observable<Nullable<ChildhoodProfileOutput>> = this.matchingProfileInput.pipe(shareReplay(1));


  requestProfile = this.matchingProfileInput.pipe(
    map(flow(ChildhoodProfile.decode, fromEither)),
    filter(isSome),
    map(getValue),
  );


  matchingProfile: Observable<MatchingItems> = this.requestProfile.pipe(
    mergeMap((req) => this.http.post('/api/request', req)),
    map(MatchingItemsC.decode),
    filter(isRight),
    map((r) => r.right),
  );


  currentProfile = this.matchingProfile.pipe(shareReplay(1));
  constructor(private http: HttpClient) {}

  findProfile(req: Nullable<ChildhoodProfileOutput>) {
    this.matchingProfileInput.next(req);

  }

}
