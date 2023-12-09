import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { fpFormGroup } from '@becoming-german/tools';
import { Grandparents } from '@becoming-german/model';
import { PersonService } from '../../person.service';
import { flow, pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
export const tap = <T>(v: T): T => {console.log(v); return v;}
@Component({
  selector: 'bgn-grandparents',
  templateUrl: './grandparents.component.html',
  styleUrls: ['./grandparents.component.scss', '../item/spenden-item.component.scss'],
})
export class GrandparentsComponent {
  form = this.fb.group(fpFormGroup(Grandparents.props));

  constructor(
    private fb: FormBuilder,
    private service: PersonService,
  ) {}

  async update() {
    const result = await pipe(
      this.form.getRawValue(),
      TE.of,
      TE.chainW((v) => this.form.invalid ? TE.left(new Error('form not valid')) : TE.right(v)),
      TE.chainW(flow(Grandparents.decode, tap, TE.fromEither)),
      TE.chainW((v) => this.service.addItem('grandparents', v)),
    )();

    if (E.isRight(result)) {
      console.log(result.right);
    } else {
      console.log(result.left);
    }
  }
}
