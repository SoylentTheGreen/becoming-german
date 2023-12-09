import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ChildhoodSituation } from '@becoming-german/model';

@Component({
  selector: 'bgn-options',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss',
})
export class OptionsComponent {
  @Input() name = '';
  @Input() type: keyof ChildhoodSituation = 'siblings';
}
