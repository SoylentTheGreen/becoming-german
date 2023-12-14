import { AfterContentInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChildhoodC, ChildhoodProfileC, ChildhoodSituationC, DonatedProfileC, Item } from '@becoming-german/model';
import { filter, map, shareReplay, Subject, Subscription } from 'rxjs';
import { PersonService } from '../../person.service';
import { fpFormGroup } from '@becoming-german/tools';
import * as E from 'fp-ts/Either';
import { getLabel, getOptions, labels, LiteralPropertiesEntries } from '../../i18n/translation';
import { UUID } from 'io-ts-types';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';


@Component({
  selector: 'bgn-spenden-home',
  templateUrl: './spenden-home.component.html',
  styleUrls: [
    './spenden-home.component.scss',
  ],
})
export class SpendenHomeComponent implements OnDestroy {
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
  profile = [
    'softToy', 'hatedFood', 'hobby', 'favoriteColor'
  ]
  options = [
    'gender',
    'siblings',
    'siblingPosition',
    'parents',
    'bedroomSituation',
    'dwellingSituation',
    'moves',
    'germanState',
  ];
  getOptions = getOptions;
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


}
