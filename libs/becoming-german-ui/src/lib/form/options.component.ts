import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getLabel, getOptions } from '../i18n/translation';
import { pipe } from 'fp-ts/function';
import * as R from 'fp-ts/Record';
import * as O from 'fp-ts/Option';

@Component({
  selector: 'bgn-options',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss',
})
export class OptionsComponent implements OnChanges {
  @Input() name = '';
  @Input() ctl: FormGroup | null = null;

  protected readonly getLabel = getLabel;
  protected readonly getOptions = getOptions;
  opts: [string, string][] = [];
  label = '';
  ngOnChanges(changes: SimpleChanges): void {
    pipe(
      changes,
      R.lookup('name'),
      O.filter((c) => c.isFirstChange()),
      O.map((c) => c.currentValue),
      O.fold(
        () => false,
        (c) => {
          this.opts = getOptions(c);
          this.label = getLabel(c);
          return true;
        },
      ),
    );
  }
}
