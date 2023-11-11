import { Component, ViewEncapsulation } from '@angular/core';
import { Book } from '@becoming-german/model';
import { ItemComponent } from './item.component';

@Component({
  selector: 'bgn-book',
  templateUrl: `./book.component.html`,
  encapsulation: ViewEncapsulation.None,
})
export class BookComponent extends ItemComponent<Book> {}
