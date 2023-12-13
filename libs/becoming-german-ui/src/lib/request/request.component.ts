import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ChildhoodProfile, ChildhoodProfileC, MatchingProfileRequestC } from '@becoming-german/model';
import { firstValueFrom, Subject } from 'rxjs';
import { isRight } from 'fp-ts/Either';
import { PersonService } from '../person.service';
import { v4 as uuid } from 'uuid';
import { fpFormGroup } from '@becoming-german/tools';
import { pipe } from 'fp-ts/function';
import * as R from 'fp-ts/Record';
import { childhoodProfileTranslations, labels, LiteralPropertiesEntries } from '../i18n/translation';

const getF =
  <T, K extends keyof T>(trans: LiteralPropertiesEntries<T>) =>
  (
    k: K,
    t: string,
  ): {
    k: K;
    t: string;
    o: LiteralPropertiesEntries<T>[K];
  } => ({ k, t, o: trans[k] });

const optionFields = getF(childhoodProfileTranslations);

@Component({
  selector: 'bgn-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnDestroy {
  val: ChildhoodProfile = pipe(
    ChildhoodProfileC.props,
    R.map(() => null),
  );
  form = this.fb.group(fpFormGroup(MatchingProfileRequestC.props));

  labels = labels();
  value = $localize`:@@label.gender:Geschlecht`;
  options = [
    optionFields('gender', this.labels['gender']),
    optionFields('siblings', this.labels['siblings']),
    optionFields('siblingPosition', this.labels['siblingPosition']),
    optionFields('parents', this.labels['parents']),
    optionFields('bedroomSituation', this.labels['bedroomSituation']),
    optionFields('dwellingSituation', this.labels['dwellingSituation']),
    optionFields('moves', this.labels['moves']),
  ];

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
    const result = MatchingProfileRequestC.decode({ ...this.form.getRawValue(), id: uuid() });

    if (isRight(result)) {
      this.service.findProfile(result.right);

      const output = await firstValueFrom(this.service.matchingProfile);
      console.log(output);
      await this.router.navigate(['request', 'result']);
    }
  }

  reset() {
    this.service.resetInput();
    this.form.reset();
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
