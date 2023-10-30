import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import * as A from 'fp-ts/Array';
import { ChildhoodProfile, Person, QueryResponse } from '@becoming-german/model';
import { flow } from 'fp-ts/function';
import { Type } from 'io-ts';
import { none, Option, some } from 'fp-ts/Option';
import { isRight } from 'fp-ts/Either';
import { PathReporter } from 'io-ts/PathReporter';

const decodeResultToOption =
  <T, O>(codec: Type<T, O>) =>
  (inp: unknown): Option<T> => {
    const v = codec.decode(inp);
    if (isRight(v)) return some(v.right);
    console.log('error mapping person from server', PathReporter.report(v));
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



  findProfile(req: ChildhoodProfile) {
    return this.http.post('/api/request', req)
  }

  constructor(private http: HttpClient) {}
}
