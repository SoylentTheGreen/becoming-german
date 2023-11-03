import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, map, mergeMap, Observable, shareReplay, Subject, tap } from 'rxjs';
import * as A from 'fp-ts/Array';
import { ChildhoodProfile, MatchingItemsC, Person, QueryResponse } from '@becoming-german/model';
import { flow } from 'fp-ts/function';
import { Type } from 'io-ts';
import { none, Option, some } from 'fp-ts/Option';
import { isRight } from 'fp-ts/Either';
import { MatchingItems } from '../../../becoming-german-model/src/lib/model/matching-item';

const decodeResultToOption =
  <T, O>(codec: Type<T, O>) =>
  (inp: unknown): Option<T> => {
    const v = codec.decode(inp);
    if (isRight(v)) return some(v.right);

    console.log('error mapping person from server', inp);
    return none;
  };

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  people: Observable<Person[]> = this.http.get<QueryResponse<unknown>>('/api/admin/profiles/0/50').pipe(
    map((v) => v.result),
    map(flow(A.map(decodeResultToOption(Person)), A.compact)),
    shareReplay(1),
  );

  private matchingProfileInput = new Subject<ChildhoodProfile>()

  matchingProfile: Observable<MatchingItems> = this.matchingProfileInput.pipe(
    mergeMap(req => this.http.post('/api/request', req)),
    tap(console.log),
    map(MatchingItemsC.decode),
    filter(isRight),
    map(r => r.right),
    shareReplay(1)
  )




  findProfile(req: ChildhoodProfile) {
    this.matchingProfileInput.next(req);
  }

  constructor(private http: HttpClient) {}
}
