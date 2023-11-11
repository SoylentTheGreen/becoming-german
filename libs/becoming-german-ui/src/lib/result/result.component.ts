import { Component, ViewEncapsulation } from '@angular/core';
import { PersonService } from '../person.service';
import { items } from '@becoming-german/model';
import { childhoodProfileTranslations } from '../i18n/translation';

@Component({
  selector: 'bgn-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ResultComponent {
  result = this.service.matchingProfile;
  request = this.service.requestProfile;
  items = items;
  translations = childhoodProfileTranslations;

  constructor(private service: PersonService) {}
}
