import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChildhoodProfile, ChildhoodProfileOutput } from '@becoming-german/model';
import { filter, firstValueFrom, map, skip, startWith } from 'rxjs';
import { childhoodProfileTranslations, labels, LiteralPropertiesRecord } from '../i18n/translation';
import { isLeft, isRight } from 'fp-ts/Either';
import { PersonService } from '../person.service';
import { Router } from '@angular/router';

export type FormGroupMap<T> = FormGroup<{
  [Property in keyof T]: T[Property] extends (infer U)[] ? FormArray<FormGroupMap<U>> : FormControl<T[Property]>;
}>;

const getF =
  <T, K extends keyof T>(trans: LiteralPropertiesRecord<T>) =>
  (k: K, t: string): { k: K; t: string; o: LiteralPropertiesRecord<T>[K] } => ({ k, t, o: trans[k] });

const optionFields = getF(childhoodProfileTranslations);

const defaultProfile: ChildhoodProfileOutput = {
  bedroomSituation: 'brother',
  birthDate: '1973-10-11',
  dwellingSituation: 'city',
  favoriteColor: 'black',
  gender: 'male',
  hobby: 'roleplaying',
  moves: '1',
  parents: 'parents',
  siblingPosition: 'youngest',
  siblings: 'two',
};

@Component({
  selector: 'bgn-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent {
  form = this.fb.nonNullable.group(defaultProfile);
  labels = labels();
  value = $localize`:@@label.gender:Geschlecht`;
  options = [
    optionFields('gender', this.labels.gender),
    optionFields('siblings', this.labels.siblings),
    optionFields('siblingPosition', this.labels.siblingPosition),
    optionFields('bedroomSituation', this.labels.bedroomSituation),
    optionFields('dwellingSituation', this.labels.dwellingSituation),
    optionFields('moves', this.labels.moves),
    optionFields('parents', this.labels.parents),
  ];
  updates = this.form.valueChanges.pipe(
    map((v) => ChildhoodProfile.decode(v)),
    startWith(ChildhoodProfile.decode(defaultProfile)),
  );
  valid = this.updates.pipe(
    filter(isRight),
    map((v) => v.right),
  );
  disabled = this.updates.pipe(map(isLeft));


  constructor(
    private fb: FormBuilder,
    private service: PersonService,
    private router: Router
  ) {}

  async getProfile() {
    this.service.findProfile(await firstValueFrom(this.valid));
    return this.router.navigate(['result'])
  }
}
