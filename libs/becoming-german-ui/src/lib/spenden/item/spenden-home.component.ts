import { AfterContentInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChildhoodC, ChildhoodProfileC, ChildhoodSituationC, DonatedProfileC, Item } from '@becoming-german/model';
import { filter, map, shareReplay, Subject, Subscription } from 'rxjs';
import { PersonService } from '../../person.service';
import { fpFormGroup } from '@becoming-german/tools';
import * as E from 'fp-ts/Either';
import { childhoodProfileTranslations, labels, LiteralPropertiesEntries } from '../../i18n/translation';
import { UUID } from 'io-ts-types';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

const testData = {
  legacyId: null,
  situation: {
    gender: 'female',
    bedroomSituation: 'brother',
    moves: '2',
    favoriteColor: 'asdfa',
    parents: 'mother',
    siblingPosition: 'middle',
    germanState: 'NW',
    birthYear: 1971,
    dwellingSituation: 'small_town',
    siblings: 'two',
    hobby: 'asdasf',
  },
  profile: {
    de: {
      memory: null,
      party: null,
      favoriteColor: 'Cerulean',
      book: null,
      dwellingSituationComment: null,
      hobby: null,
      softToy: null,
      song: null,
      hatedFood: 'Brussel sprouts',
      holidays: null,
      grandparents: null,
      audioBook: null,
    },
    en: {
      memory: null,
      party: null,
      favoriteColor: null,
      book: null,
      dwellingSituationComment: null,
      hobby: null,
      softToy: null,
      song: null,
      hatedFood: null,
      holidays: null,
      grandparents: null,
      audioBook: null,
    },
  },
};

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
  ],
})
export class SpendenHomeComponent implements OnDestroy, AfterContentInit {
  form = this.fb.group({
    ...fpFormGroup({ id: UUID }),
    situation: this.fb.group(fpFormGroup(ChildhoodSituationC.props)),
    profile: this.fb.group(fpFormGroup(ChildhoodProfileC.props)),
  });

  childhood = this.service.donation.pipe(
    filter(E.isRight),
    map(v => ChildhoodC.decode(v.right.state)),
    filter(E.isRight),
    map(v => v.right)
  );

  state = this.service.donation.pipe(
    map(E.toUnion),
    map((v) => DonatedProfileC.decode(v.state)),
    filter(E.isRight),
    map((v) => v.right),
    shareReplay(1),
  );

  birthYear = new FormControl(1970, [Validators.min(1900), Validators.max(2010), Validators.required]);

  active: Item | null = null;

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
  profileAdded = false;
  submit = new Subject<boolean>();
  subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private service: PersonService,
    private router: Router,
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async doUpdate() {
    return pipe(
      this.form.getRawValue(),
      E.fromPredicate(
        (v) => v.id === null,
        () => new Error('id already set.'),
      ),
      E.chainW((v) => ChildhoodSituationC.decode(v.situation)),
      TE.fromEither,
      TE.chainW((v) => TE.fromTask(() => this.service.addProfile(v))),
      TE.map((v) => {
        this.profileAdded = true;
        this.active = 'book';
        return v;
      }),
    )();

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

  ngAfterContentInit(): void {
    this.form.patchValue(testData as any);
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
