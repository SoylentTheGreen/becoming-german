import { Component, Inject, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'bgn-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent {
  constructor(@Inject(LOCALE_ID) public locale: string) {}
}
