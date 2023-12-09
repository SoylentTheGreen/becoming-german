import { Component } from '@angular/core';
import { Childhood, ChildhoodProfile, ChildhoodSituation, getItemStatus, items } from '@becoming-german/model';
import { Observable, shareReplay, Subject } from 'rxjs';
import { PersonService } from '../../person.service';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';

export const labels: () => Record<keyof ChildhoodProfile | keyof ChildhoodSituation, string> = () => ({
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
  audioBook: $localize`:@@label.admin.audiobook:Favorite Audiobook`,
  birthDate: $localize`:@@label.admin.birthDate:Birthdate`,
  hatedFood: $localize`:@@label.admin.germanState:German State`,
  softToy: $localize`:@@label.admin.softToy:Stofftier`,
});

@Component({
  selector: 'bgn-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  people = this.service.people;
  labels = labels();
  situationFields: (keyof ChildhoodSituation)[] = [
    'gender',
    'siblings',
    'siblingPosition',
    'bedroomSituation',
    'dwellingSituation',
    'moves',
    'parents',
  ];
  active = new Subject<Childhood>();
  activePerson: Observable<Childhood> = this.active.pipe(shareReplay(1));

  constructor(private service: PersonService) {}

  itemsStatus(childhood: Childhood): [keyof ChildhoodProfile, boolean][] {
    return pipe(
      childhood.profile.de,
      O.fromNullable,
      O.map(getItemStatus),
      O.fold(
        () => items.map((i) => [i, false]),
        (stats) => items.map((i) => [i, stats[i]]),
      ),
    );
  }

  protected readonly getItemStatus = getItemStatus;
}
