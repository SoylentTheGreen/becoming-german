import { Component, ViewEncapsulation } from '@angular/core';
import { ItemComponent } from './item.component';
import { Party } from '@becoming-german/model';

@Component({
  selector: 'bgn-party',
  templateUrl: './party.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class PartyComponent extends ItemComponent<Party>{}
