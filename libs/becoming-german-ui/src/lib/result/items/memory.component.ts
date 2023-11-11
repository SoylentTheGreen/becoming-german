import { Component, ViewEncapsulation } from '@angular/core';
import { ItemComponent } from './item.component';
import { Memory } from '@becoming-german/model';

@Component({
  selector: 'bgn-memory',
  templateUrl: './memory.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MemoryComponent extends ItemComponent<Memory> {}
