import { Component } from '@angular/core';
import { PersonService } from '../person.service';
import { ChildhoodProfile, items } from '@becoming-german/model';
import { childhoodProfileTranslationsMapped } from '../i18n/translation';
import { map, Observable } from 'rxjs';
import { pipe } from 'fp-ts/function';
import * as R from 'fp-ts/Record';
import * as O from 'fp-ts/Option';

const translated = (p: ChildhoodProfile) =>
  (k: keyof ChildhoodProfile): string | number => {
    const value = p[k];
    if(value === null) return '';
    if(typeof value != 'string') return value;
    return pipe(
      childhoodProfileTranslationsMapped,
      R.lookup(k),
      O.chain(R.lookup(value)),
      O.getOrElse(() => value)
    );
  }


@Component({
  selector: 'bgn-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent {
  result = this.service.matchingProfile;
  request: Observable<ChildhoodProfile> = this.service.requestProfile;
  items = items;
  translated = this.request.pipe(map(translated));

  constructor(private service: PersonService) {}

}
