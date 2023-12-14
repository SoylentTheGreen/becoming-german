import { Component, Inject, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'bgn-spenden',
  templateUrl: './spenden.component.html',
  styleUrls: ['./spenden.component.scss'],
})
export class SpendenComponent {

  constructor(@Inject(LOCALE_ID) public locale: string) {}
}
