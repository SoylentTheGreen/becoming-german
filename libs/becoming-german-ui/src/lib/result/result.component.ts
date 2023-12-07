import { Component } from '@angular/core';
import { PersonService } from '../person.service';
import { ChildhoodProfile, ChildhoodProfileOptionProps, items } from '@becoming-german/model';
import { childhoodProfileTranslationsMapped } from '../i18n/translation';
import { map, Observable } from 'rxjs';
import { pipe } from 'fp-ts/function';
import * as R from 'fp-ts/Record';
import * as O from 'fp-ts/Option';
import { keyof } from 'io-ts';

const isKeyOf =
  <T extends object>(type: T) =>
  (key: unknown): key is keyof T =>
    (Object.keys(type) as unknown[]).includes(key);

const isOptionKey = isKeyOf(ChildhoodProfileOptionProps);
const translated =
  (p: ChildhoodProfile) =>
  (k: keyof ChildhoodProfile): string | number => {
    const value = p[k];
    if (value === null) return '';
    if (isOptionKey(k) && isKeyOf(childhoodProfileTranslationsMapped[k])(value))
      return childhoodProfileTranslationsMapped[k][value];
    return 'nope';
  };

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
