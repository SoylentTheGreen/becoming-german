import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChildhoodProfile, ChildhoodProfileOutput } from '@becoming-german/model';
import { filter, firstValueFrom, map, mergeMap, startWith, take } from 'rxjs';
import { childhoodProfileTranslations, LiteralPropertiesRecord } from '../i18n/translation';
import { isLeft, isRight } from 'fp-ts/Either';
import { PersonService } from '../person.service';

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

  options = [
    optionFields('gender', $localize`:@@label.gender:Gender`),
    optionFields('siblings', $localize`:@@label.siblings:Siblings`),
    optionFields('siblingPosition', $localize`:@@label.siblingPosition:SiblingPosition`),
    optionFields('bedroomSituation', $localize`:@@label.bedroom:Bedrooms Situation`),
    optionFields('dwellingSituation', $localize`:@@label.dwelling:Dwelling Location`),
    optionFields('moves', $localize`:@@label.moves:House Moves`),
    optionFields('parents', $localize`:@@label.parents:Parental Situation`),
  ];
  updates = this.form.valueChanges.pipe(
    map((v) => ChildhoodProfile.decode(v)),
    startWith(ChildhoodProfile.decode(defaultProfile))
  );
  valid = this.updates.pipe(filter(isRight), map(v => v.right))
  disabled = this.updates.pipe(map(isLeft));
  result = this.service.matchingProfile

  constructor(private fb: FormBuilder, private service: PersonService) {}

  async getProfile() {
    this.service.findProfile(await(firstValueFrom(this.valid)));
  }
}
