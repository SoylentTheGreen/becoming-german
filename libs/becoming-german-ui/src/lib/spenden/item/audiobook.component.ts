import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { fpFormGroup } from '@becoming-german/tools';
import { PersonService } from '../../person.service';
import { AudioBook } from '@becoming-german/model';

@Component({
  selector: 'bgn-audiobook',
  templateUrl: './audiobook.component.html',
  styleUrls: ['./audiobook.component.scss','../item/spenden-item.component.scss'],
})
export class AudiobookComponent {
  form = this.fb.group(fpFormGroup(AudioBook.props));

  constructor(
    private fb: FormBuilder,
    private service: PersonService,
  ) {}
}
