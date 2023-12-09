import { Component, HostListener, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Childhood, ChildhoodProfileC, ChildhoodSituationC } from '@becoming-german/model';
import { firstValueFrom, Subject, Subscription } from 'rxjs';
import { PersonService } from '../../person.service';
import { v4 as uuid } from 'uuid';
import { fpFormGroup } from '@becoming-german/tools';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import { childhoodProfileTranslations, labels, LiteralPropertiesEntries } from '../../i18n/translation';
import { UUID } from 'io-ts-types';
import { pipe } from 'fp-ts/function';
import { reporter } from 'io-ts-reporters';

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

const testValues = {
  birthDate: '1970-01-02',
  gender: 'female',
  parents: 'mother',
  siblings: 'two',
  siblingPosition: 'middle',
  bedroomSituation: 'brother',
  dwellingSituation: 'small_town',
  moves: '2',
  hobby: 'asdasf',
  favoriteColor: 'asdfa',
  germanState: 'NW',
};

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
    ...fpFormGroup({id: UUID}),
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

  @HostListener('input[', ['$event.target.valueAsDate']) onChange = (_: unknown) => {
    console.log('something changed', _);
  }
  // subscription = this.service.profileInput.subscribe((p) => this.form.patchValue(p));

  constructor(
    private fb: FormBuilder,
    private service: PersonService,
    private router: Router,
  ) {
    this.form.patchValue({
      situation: {
        birthDate: new Date('1970-01-02'),
        gender: 'female',
        parents: 'mother',
        siblings: 'two',
        siblingPosition: 'middle',
        bedroomSituation: 'brother',
        dwellingSituation: 'small_town',
        moves: '2',
        germanState: 'NW',
      },
      profile: {
        hobby: 'my hobby',
        favoriteColor: 'fav color',
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async doUpdate() {

    const result =
      pipe(
        this.form.getRawValue(),
        v => v.id ? E.left(new Error('id already set.')) : E.right(v),
        E.chain(v => pipe(ChildhoodSituationC.decode(v.situation), E.mapLeft(() => new Error('parsing failed')))),

      );
    if(E.isRight(result)) {
      const res = await firstValueFrom(this.service.addProfile(result.right))
      this.form.patchValue(res.payload as any)
    } else {
      console.log(result)
    }

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
