import { Component } from '@angular/core';
import { PersonService } from '../person.service';
import { items, MatchingProfileRequest } from '@becoming-german/model';
import { map } from 'rxjs';
import { getOpt } from '../i18n/translation';
import { isString } from 'fp-ts/string';

const get =
  (req: MatchingProfileRequest) =>
  <K extends keyof MatchingProfileRequest>(field: K) => {
    const val = req[field];
    if (isString(val)) return getOpt(field, val);
    return val;
  };

@Component({
  selector: 'bgn-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent {
  result = this.service.matchingProfile;
  request = this.service.requestProfile;
  items = items;
  translated = this.request.pipe(map(get));



  constructor(private service: PersonService) {}

  toggleEastWest() {
    return this.service.toggleEastWest()
  }
}
