import { Component, ViewEncapsulation } from '@angular/core';
import { ItemComponent } from './item.component';


@Component({
  selector: 'bgn-memory',
  templateUrl: './memory.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MemoryComponent extends ItemComponent<string> {}
