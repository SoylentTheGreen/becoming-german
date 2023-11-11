import { Component } from '@angular/core';
import { PersonService } from '../person.service';
import { ChildhoodProfile, items } from '@becoming-german/model';
import { childhoodProfileTranslations } from '../i18n/translation';
import { Observable } from 'rxjs';

@Component({
  selector: 'bgn-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent {
  result = this.service.matchingProfile;
  request: Observable<ChildhoodProfile> = this.service.requestProfile;
  items = items;
  translations = childhoodProfileTranslations;

  constructor(private service: PersonService) {}
}
