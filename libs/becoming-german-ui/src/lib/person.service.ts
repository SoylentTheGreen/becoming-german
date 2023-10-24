import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person } from '@becoming-german/model';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  people = this.http.get<Person[]>('/api').pipe(shareReplay(1));
  constructor(private http: HttpClient) {}
}
