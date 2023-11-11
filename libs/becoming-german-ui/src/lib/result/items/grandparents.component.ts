import { Component, ViewEncapsulation } from '@angular/core';
import { Grandparents } from '@becoming-german/model';
import { ItemComponent } from './item.component';

@Component({
  selector: 'bgn-grandparents',
  templateUrl: `./grandparents.component.html`
})
export class GrandparentsComponent extends ItemComponent<Grandparents> {}
