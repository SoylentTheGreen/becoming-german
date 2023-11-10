import { Component } from '@angular/core';
import { PersonService } from '../../person.service';
import { getItemStatus, items, Person, ymd } from '@becoming-german/model';
import { Observable, shareReplay, Subject } from 'rxjs';


export const labels: Record<keyof Person, string> = {
  id: $localize`:@@label.admin.id:ID`,
  birthDate: $localize`:@@label.admin.birthDate:DoB`,
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
  fields: (keyof Person)[] = [
    'id',
    'birthDate',
    'gender',
    'siblings',
    'siblingPosition',
    'bedroomSituation',
    'dwellingSituation',
    'moves',
    'parents',
    'germanState',
  ];
  active = new Subject<Person>();
  activePerson: Observable<Person> = this.active.pipe(shareReplay(1));

  constructor(private service: PersonService) {}

  format(field: (typeof this.fields)[number], value: unknown) {
    return field === 'birthDate' ? ymd(value as Date) : value;
  }

  itemsStatus(person: Person): [keyof Person, boolean][] {
    const stats = getItemStatus(person)
    return items.map(i => [i, stats[i]])
  }

  protected readonly getItemStatus = getItemStatus;
}
