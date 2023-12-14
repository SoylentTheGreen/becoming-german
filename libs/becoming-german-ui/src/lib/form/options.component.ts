import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getLabel, getOptions } from '../i18n/translation';

@Component({
  selector: 'bgn-options',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss',
})
export class OptionsComponent {
  @Input() name = '';
  @Input() ctl: FormGroup | null = null;

  protected readonly getLabel = getLabel;
  protected readonly getOptions = getOptions;
}
