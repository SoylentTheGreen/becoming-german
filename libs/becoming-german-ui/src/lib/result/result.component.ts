import { Component } from '@angular/core';
import { PersonService } from '../person.service';
import { items } from '@becoming-german/model';
import { map } from 'rxjs';

@Component({
  selector: 'bgn-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent {
  result = this.service.matchingProfile;
  items = items;
  book = this.result.pipe(map(r => r.book));

  constructor(private service: PersonService) {}
}
