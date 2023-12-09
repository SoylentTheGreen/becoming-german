import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ChildhoodProfileC, ChildhoodSituationC } from '@becoming-german/model';
import { firstValueFrom, Subject, Subscription } from 'rxjs';
import { isRight } from 'fp-ts/Either';
import { PersonService } from '../../person.service';
import { v4 as uuid } from 'uuid';
import { fpFormGroup } from '@becoming-german/tools';
import { childhoodProfileTranslations, labels, LiteralPropertiesEntries } from '../../i18n/translation';

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
  selector: 'bgn-spenden-home',
  templateUrl: './spenden-home.component.html',
  styleUrls: [
    './spenden-home.component.scss',
    '../../start/start.component.scss',
    '../../request/request.component.scss',
  ],
})
export class SpendenHomeComponent implements OnDestroy {
  form = this.fb.group({
    situation: this.fb.group(fpFormGroup(ChildhoodSituationC.props)),
    profile: this.fb.group(fpFormGroup(ChildhoodProfileC.props)),
  });
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
    optionFields('germanState', this.labels.germanState),
  ];

  submit = new Subject<boolean>();
  subscription = new Subscription();

  // subscription = this.service.profileInput.subscribe((p) => this.form.patchValue(p));

  constructor(
    private fb: FormBuilder,
    private service: PersonService,
    private router: Router,
  ) {
    console.log(this.form.getRawValue());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async doUpdate() {
    const result = ChildhoodSituationC.decode({ ...this.form.controls.situation.getRawValue(), id: uuid() });

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
}
