import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, mergeMap, Observable, shareReplay } from 'rxjs';
import * as A from 'fp-ts/Array';
import { ChildhoodProfile, MatchingItems, MatchingItemsC, Person, QueryResponse } from '@becoming-german/model';
import { flow } from 'fp-ts/function';
import { Type } from 'io-ts';
import { isSome, none, Option, Some, some } from 'fp-ts/Option';
import { isRight } from 'fp-ts/Either';

const decodeResultToOption =
  <T, O>(codec: Type<T, O>) =>
  (inp: unknown): Option<T> => {
    const v = codec.decode(inp);
    if (isRight(v)) return some(v.right);

    console.log('error mapping person from server', inp);
    return none;
  };

const getValue = <T>(i: Some<T>) => i.value
@Injectable({
  providedIn: 'root',
})
export class PersonService {
  people: Observable<Person[]> = this.http.get<QueryResponse<unknown>>('/api/admin/profiles/0/50').pipe(
    map((v) => v.result),
    map(flow(A.map(decodeResultToOption(Person)), A.compact)),
    shareReplay(1),
  );


  private matchingProfileInput = new BehaviorSubject<Option<ChildhoodProfile>>(none)
  requestProfile = this.matchingProfileInput.pipe(
    filter(isSome),
    map(getValue),
    shareReplay(1));

  matchingProfile: Observable<MatchingItems> = this.requestProfile.pipe(
    mergeMap(req => this.http.post('/api/request', req)),
    map(MatchingItemsC.decode),
    filter(isRight),
    map(r => r.right),
    shareReplay(1)
  )

  findProfile(req: ChildhoodProfile) {
    this.matchingProfileInput.next(some(req));
  }

  constructor(private http: HttpClient) {}
}
