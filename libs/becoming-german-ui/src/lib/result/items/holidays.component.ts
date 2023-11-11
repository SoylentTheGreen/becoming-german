import { Component, ViewEncapsulation } from '@angular/core';
import { ItemComponent } from './item.component';
import { Holidays } from '@becoming-german/model';

@Component({
  selector: 'bgn-holidays',
  templateUrl: './holidays.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HolidaysComponent extends ItemComponent<Holidays>{}
