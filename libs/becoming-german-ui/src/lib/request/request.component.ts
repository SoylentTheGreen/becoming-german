import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChildhoodProfile, ChildhoodProfileOutput } from '@becoming-german/model';
import { filter, firstValueFrom, map, shareReplay, startWith, Subject, switchMap, tap } from 'rxjs';
import { childhoodProfileTranslations, labels, LiteralPropertiesRecord } from '../i18n/translation';
import { isLeft, isRight } from 'fp-ts/Either';
import { PersonService } from '../person.service';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { pipe } from 'fp-ts/function';

export type FormGroupMap<T> = FormGroup<{
  [Property in keyof T]: T[Property] extends (infer U)[] ? FormArray<FormGroupMap<U>> : FormControl<T[Property]>;
}>;

const getF =
  <T, K extends keyof T>(trans: LiteralPropertiesRecord<T>) =>
  (k: K, t: string): { k: K; t: string; o: LiteralPropertiesRecord<T>[K] } => ({ k, t, o: trans[k] });

const optionFields = getF(childhoodProfileTranslations);

const defaultProfile: ChildhoodProfileOutput = {
  id: uuid(),
  bedroomSituation: 'brother',
  birthYear: 1973,
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
  updates = this.form.valueChanges.pipe(startWith(this.form.value), map(ChildhoodProfile.decode));
  valid = this.updates.pipe(
    filter(isRight),
    map((v) => v.right),
    shareReplay(1),
  );
  disabled = this.updates.pipe(
    map(isLeft),
    startWith(true),
    shareReplay(1)
  );
  currentYear = new Date().getFullYear();

  submit = new Subject<boolean>();
  private sub = this.submit
    .pipe(
      switchMap(() => this.valid),
      tap(console.log),
      tap((p) => this.service.findProfile(p)),
    )
    .subscribe(() => this.router.navigate(['result']));

  constructor(
    private fb: FormBuilder,
    private service: PersonService,
    private router: Router,
  ) {}

  async doUpdate() {

    const valid = await firstValueFrom(this.valid);
    console.log(valid);
  }

  modifiedYear(amount: number) {
    const current = this.form.controls.birthYear.value;
    const newVal = current + amount;
    if (newVal < 1900) return 1900;
    return newVal > this.currentYear - 10 ? this.currentYear - 10 : newVal;
  }

  modYear(amount: number) {
    this.form.controls.birthYear.setValue(this.modifiedYear(amount), { emitEvent: true, onlySelf: false });
  }
}
