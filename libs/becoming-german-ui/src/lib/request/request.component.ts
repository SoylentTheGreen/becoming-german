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
import { getLabel, getOptions, labels } from '../i18n/translation';

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

  options = ['gender', 'siblings', 'siblingPosition', 'parents', 'bedroomSituation', 'dwellingSituation', 'moves'];

  submit = new Subject<boolean>();
  subscription = this.service.profileInput.subscribe((p) => this.form.patchValue(p));
  constructor(
    private fb: FormBuilder,
    private service: PersonService,
    private router: Router,
  ) {
    this.subscription.add(this.form.valueChanges.subscribe(console.log))
  }

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

  protected readonly getLabel = getLabel;
}
