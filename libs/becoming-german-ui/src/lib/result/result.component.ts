import { Component } from '@angular/core';
import { PersonService } from '../person.service';
import { items, MatchingProfileRequest } from '@becoming-german/model';
import { map } from 'rxjs';
import { childhoodProfileTranslationsMapped } from '../i18n/translation';

const get =
  (req: MatchingProfileRequest) =>
  <K extends keyof MatchingProfileRequest>(field: K) => {
    switch (field) {
      case 'siblings':
        return childhoodProfileTranslationsMapped.siblings[req['siblings']];
      case 'parents':
        return childhoodProfileTranslationsMapped.parents[req['parents']];
      case 'siblingPosition':
        return childhoodProfileTranslationsMapped.siblingPosition[req['siblingPosition']];
      case 'birthYear':
        return req[field];
      case 'gender':
        return childhoodProfileTranslationsMapped.gender[req['gender']];
      case 'dwellingSituation':
        return childhoodProfileTranslationsMapped.dwellingSituation[req['dwellingSituation']];
      case 'bedroomSituation':
        return childhoodProfileTranslationsMapped.bedroomSituation[req['bedroomSituation']];
      case 'moves':
        return childhoodProfileTranslationsMapped.moves[req['moves']];
      case 'favoriteColor':
      case 'westOnly':
      case 'hobby':
      case 'eastOnly':
    }
    return req[field];
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
}
