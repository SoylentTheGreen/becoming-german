import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ChildhoodProfile, ChildhoodProfileOutput } from '@becoming-german/model';
import { firstValueFrom, Subject } from 'rxjs';
import { childhoodProfileTranslations, labels, LiteralPropertiesRecord } from '../i18n/translation';
import { isRight } from 'fp-ts/Either';
import * as R from 'fp-ts/Record';
import { Nullable, PersonService } from '../person.service';
import { pipe } from 'fp-ts/function';
import { v4 as uuid } from 'uuid';
import { fpFormGroup } from '@becoming-german/tools';

const getF =
  <T, K extends keyof T>(trans: LiteralPropertiesRecord<T>) =>
  (
    k: K,
    t: string,
  ): {
    k: K;
    t: string;
    o: LiteralPropertiesRecord<T>[K];
  } => ({ k, t, o: trans[k] });

const optionFields = getF(childhoodProfileTranslations);

@Component({
  selector: 'bgn-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss', '../standard-layout/standard-layout.component.scss'],
})
export class RequestComponent implements OnDestroy {
  val: Nullable<ChildhoodProfileOutput> = pipe(
    ChildhoodProfile.props,
    R.map(() => null),
  );
  form = this.fb.group(fpFormGroup(ChildhoodProfile.props));

  labels = labels();
  value = $localize`:@@label.gender:Geschlecht`;
  options = [
    optionFields('gender', this.labels.gender),
    optionFields('siblings', this.labels.siblings),
    optionFields('siblingPosition', this.labels.siblingPosition),
    optionFields('parents', this.labels.parents),
    optionFields('bedroomSituation', this.labels.bedroomSituation),
    optionFields('dwellingSituation', this.labels.dwellingSituation),
    optionFields('moves', this.labels.moves),
  ];

  currentYear = new Date().getFullYear();

  submit = new Subject<boolean>();

  subscription = this.service.profileInput.subscribe((p) => this.form.patchValue(p));

  constructor(
    private fb: FormBuilder,
    private service: PersonService,
    private router: Router,
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async doUpdate() {
    const result = ChildhoodProfile.decode({ ...this.form.getRawValue(), id: uuid() });

    if (isRight(result)) {
      this.service.findProfile(result.right);

      await firstValueFrom(this.service.requestProfile);
      await this.router.navigate(['request', 'result']);
    }
  }

  modifiedYear(amount: number) {
    const current = this.form.controls.birthYear.value;
    const newVal = (current || 0) + amount;
    if (newVal < 1900) return 1900;
    return newVal > this.currentYear - 10 ? this.currentYear - 10 : newVal;
  }

  modYear(amount: number) {
    this.form.controls['birthYear'].setValue(this.modifiedYear(amount), { emitEvent: true, onlySelf: false });
  }

  reset() {
    this.service.resetInput();
  }

  yearOnly(event: KeyboardEvent, currentValue: string | null) {
    const allowedKeys = ['Delete', 'Backspace', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    const pattern = /[0-9]/;

    if (allowedKeys.includes(event.key)) return;
    if (pattern.test(event.key) && (currentValue || '').length < 4) return;

    event.preventDefault();
    return;
  }
}
