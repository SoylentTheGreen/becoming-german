import { Component, Inject, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'bgn-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  constructor( @Inject(LOCALE_ID) public localeId: 'en' | 'de') {}
}
