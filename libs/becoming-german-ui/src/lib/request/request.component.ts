import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChildhoodProfile } from '@becoming-german/model';
import { map, tap } from 'rxjs';
import { childhoodProfileTranslations, LiteralPropertiesRecord } from '../i18n/translation';
import { PathReporter } from 'io-ts/PathReporter';

export type FormGroupMap<T> = FormGroup<{
  [Property in keyof T]: T[Property] extends (infer U)[] ? FormArray<FormGroupMap<U>> : FormControl<T[Property]>;
}>;

type NullableProperties<T> = {
  [P in keyof T]: T[P] | null;
};

const nulledObj: ChildhoodProfile = {
  birthDate: new Date(),
  dwellingSituation: 'city',
  moves: '0',
  parents: 'parents',
  siblingPosition: 'only',
  germanState: 'HH',
  gender: 'male',
  siblings: 'none',
  bedroomSituation: 'own',
};






const getF = <T, K extends keyof T>(trans: LiteralPropertiesRecord<T>)  =>
 (k: K, t: string): {k: K, t: string,  o: LiteralPropertiesRecord<T>[K]} => ({k, t, o: trans[k]});


const optionFields = getF(childhoodProfileTranslations);

@Component({
  selector: 'bgn-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent {


  form: FormGroupMap<NullableProperties<ChildhoodProfile>> = this.fb.group(nulledObj);

  options = [
    optionFields('gender', $localize`:@@label.gender:Gender`),
    optionFields('siblings', $localize`:@@label.siblings:Siblings`),
    optionFields('siblingPosition', $localize`:@@label.siblingPosition:SiblingPosition`),
    optionFields('bedroomSituation', $localize`:@@label.bedroom:Bedrooms Situation`),
    optionFields('dwellingSituation', $localize`:@@label.dwelling:Dwelling Location`),
    optionFields('moves', $localize`:@@label.moves:House Moves`),
    optionFields('parents', $localize`:@@label.parents:Parental Situation`),
    optionFields('germanState', $localize`:@@label.state:German State`),
  ];

  updates = this.form.valueChanges
    .pipe(
      map((v) => ChildhoodProfile.decode(v)),
      tap(console.log),
    )
    .subscribe((r) => {
      console.log(PathReporter.report(r));
    });

  constructor(private fb: FormBuilder) {}
}
