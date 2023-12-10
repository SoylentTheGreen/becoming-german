import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bgn-collapsible',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collapsible.component.html',
  styleUrl: './collapsible.component.scss',
})
export class CollapsibleComponent {
  @Input() active: string | null = null;
  @Output() out = new EventEmitter();
  @Input() lbl = '';
  @Input() name = '';

}
