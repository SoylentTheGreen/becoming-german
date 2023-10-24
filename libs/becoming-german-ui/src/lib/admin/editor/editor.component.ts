import { Component } from '@angular/core';
import { PersonService } from '../../person.service';
import { Person } from '@becoming-german/model';
import { Observable, shareReplay, Subject } from 'rxjs';

export const labels: Record<keyof Person, string> = {
  id: $localize`:@@label.admin.id:ID`,
  birthDate: $localize`:@@label.admin.birthDate:DoB`,
  gender: $localize`:@@label.admin.gender:Sex`,
  siblings: $localize`:@@label.admin.siblings:Sibs`,
  siblingPosition: $localize`:@@label.admin.siblingPosition:Sib Pos`,
  bedroomSituation: $localize`:@@label.admin.bedroom:Bed`,
  dwellingSituation: $localize`:@@label.admin.dwelling:Dwelling`,
  dwellingSituationComment: $localize`:@@label.admin.dwelling:Dwelling Comment`,
  moves: $localize`:@@label.admin.moves:Moves`,
  parents: $localize`:@@label.admin.parents:Parent`,
  germanState: $localize`:@@label.admin.state:State`,
  memory: $localize`:@@label.admin.memory:Memory`,
  memoryEnglish: $localize`:@@label.admin.memoryEnglish:Memory English`
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
    'germanState'
  ];
  active = new Subject<Person>();

  activePerson: Observable<Person> = this.active.pipe(shareReplay(1));

  constructor(private service: PersonService) {}
}
