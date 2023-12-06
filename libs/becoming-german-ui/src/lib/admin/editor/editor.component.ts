import { Component } from '@angular/core';
import { getItemStatus, items, SearchableProfile } from '@becoming-german/model';
import { Observable, shareReplay, Subject } from 'rxjs';
import { PersonService } from '../../person.service';

export const labels: Record<keyof SearchableProfile, string> = {
  id: $localize`:@@label.admin.id:ID`,
  birthYear: $localize`:@@label.admin.birthDate:Born`,
  gender: $localize`:@@label.admin.gender:Sex`,
  siblings: $localize`:@@label.admin.siblings:Sibs`,
  siblingPosition: $localize`:@@label.admin.siblingPosition:Sib Pos`,
  bedroomSituation: $localize`:@@label.admin.bedroom:Bed`,
  dwellingSituation: $localize`:@@label.admin.dwelling:Dwelling`,
  dwellingSituationComment: $localize`:@@label.admin.dwelling-comment:Dwelling Comment`,
  moves: $localize`:@@label.admin.moves:Moves`,
  parents: $localize`:@@label.admin.parents:Parent`,
  germanState: $localize`:@@label.admin.state:State`,
  memory: $localize`:@@label.admin.memory:Memory`,
  hobby: $localize`:@@label.admin.hobby:Hobby`,
  favoriteColor: $localize`:@@label.admin.favoriteColor:Favourite Colour`,
  book: $localize`:@@label.admin.book:Favorite Book`,
  grandparents: $localize`:@@label.admin.grandparents:Grandparents`,
  song: $localize`:@@label.admin.song:Favorite Song`,
  holidays: $localize`:@@label.admin.holidays:Holidays`,
  party: $localize`:@@label.admin.party:Party`,
  speaking_book: $localize`:@@label.admin.audiobook:Favorite Audiobook`,
};

@Component({
  selector: 'bgn-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {

  people = this.service.people;
  labels = labels;
  fields: (keyof SearchableProfile)[] = [
    'birthYear',
    'gender',
    'siblings',
    'siblingPosition',
    'bedroomSituation',
    'dwellingSituation',
    'moves',
    'parents',
    'germanState',
  ];
  active = new Subject<SearchableProfile>();
  activePerson: Observable<SearchableProfile> = this.active.pipe(shareReplay(1));

  constructor(private service: PersonService) {}

  itemsStatus(SearchableProfile: SearchableProfile): [keyof SearchableProfile, boolean][] {
    const stats = getItemStatus(SearchableProfile)
    return items.map(i => [i, stats[i]])
  }

  protected readonly getItemStatus = getItemStatus;
}
