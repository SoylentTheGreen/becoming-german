import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Book } from '@becoming-german/model';
import { fpFormGroup } from '@becoming-german/tools';
import { PersonService } from '../../person.service';

@Component({
  selector: 'bgn-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss','../item/spenden-item.component.scss'],
})
export class BookComponent {
  form = this.fb.group(fpFormGroup(Book.props));

  constructor(
    private fb: FormBuilder,
    private service: PersonService,
  ) {}
}
