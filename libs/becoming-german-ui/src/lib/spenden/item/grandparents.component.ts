import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { fpFormGroup } from '@becoming-german/tools';
import { Childhood, DonatedProfileC, Grandparents } from '@becoming-german/model';
import { PersonService } from '../../person.service';
import { flow, pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { filter, map } from 'rxjs';
import * as R from 'fp-ts/Record';
import * as O from 'fp-ts/Option';

@Component({
  selector: 'bgn-grandparents',
  templateUrl: './grandparents.component.html',
  styleUrls: ['./grandparents.component.scss', '../item/spenden-item.component.scss'],
})
export class GrandparentsComponent {
  form = this.fb.group(fpFormGroup(Grandparents.props));
  private sub = this.service.spendenProfile
    .pipe(
      map(
        flow(
          DonatedProfileC.decode,
          O.fromEither,
          O.chain((v) => O.fromNullable(v.profile?.de?.grandparents)),
        ),
      ),
      filter(O.isSome),
      map(v => v.value)
    )
    .subscribe((v) => this.form.patchValue(v));

  constructor(
    private fb: FormBuilder,
    private service: PersonService,
  ) {}

  async update() {
    const result = await pipe(
      this.form.getRawValue(),
      TE.of,
      TE.chainW((v) => (this.form.invalid ? TE.left(new Error('form not valid')) : TE.right(v))),
      TE.chainW(flow(Grandparents.decode, TE.fromEither)),
      TE.chainW((v) => this.service.addItem('grandparents', v)),
    )();

    if (E.isRight(result)) {
      console.log(result.right);
    } else {
      console.log(result.left);
    }
  }
}
