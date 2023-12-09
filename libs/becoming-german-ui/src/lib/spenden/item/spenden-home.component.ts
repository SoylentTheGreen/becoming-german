import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ChildhoodSituationC } from '@becoming-german/model';
import { firstValueFrom, Subject } from 'rxjs';
import { isRight } from 'fp-ts/Either';
import { PersonService } from '../../person.service';
import { v4 as uuid } from 'uuid';
import { fpFormGroup } from '@becoming-german/tools';

@Component({
  selector: 'bgn-spenden-home',
  templateUrl: './spenden-home.component.html',
  styleUrls: [
    './spenden-home.component.scss',
    '../../start/start.component.scss',
    '../../request/request.component.scss',
  ],
})
export class SpendenHomeComponent implements OnDestroy {
  form = this.fb.group(fpFormGroup(ChildhoodSituationC.props));

  value = $localize`:@@label.gender:Geschlecht`;
  options = [
    // optionFields('gender', this.labels.gender),
    // optionFields('siblings', this.labels.siblings),
    // optionFields('siblingPosition', this.labels.siblingPosition),
    // optionFields('parents', this.labels.parents),
    // optionFields('bedroomSituation', this.labels.bedroomSituation),
    // optionFields('dwellingSituation', this.labels.dwellingSituation),
    // optionFields('moves', this.labels.moves),
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
    const result = ChildhoodSituationC.decode({ ...this.form.getRawValue(), id: uuid() });

    // if (isRight(result)) {
    //   this.service.findProfile(result.right);
    //
    //   await firstValueFrom(this.service.spendenProfile);
    //   await this.router.navigate(['spenden-home', 'spenden-items']);
    // }
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

