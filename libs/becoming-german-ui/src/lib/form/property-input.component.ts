import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getLabel } from '../i18n/translation';

@Component({
  selector: 'bgn-property-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-input.component.html',
  styleUrl: './property-input.component.scss',
})
export class PropertyInputComponent {
  @Input() name = '';
  @Input() ctl: FormGroup | null = null;
  @Input() isYear = false;

  protected readonly getLabel = getLabel;

  yearOnly(event: KeyboardEvent, currentValue: string | null) {
    const allowedKeys = ['Delete', 'Backspace', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    const pattern = /[0-9]/;

    if (allowedKeys.includes(event.key)) return;
    if (pattern.test(event.key) && (currentValue || '').length < 4) return;

    event.preventDefault();
    return;
  }
}
