import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Party } from '@becoming-german/model';
import { fpFormGroup } from '@becoming-german/tools';
import { PersonService } from '../../person.service';

@Component({
  selector: 'bgn-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss','../item/spenden-item.component.scss'],
})
export class PartyComponent {
  form = this.fb.group(fpFormGroup(Party.props));

  constructor(
    private fb: FormBuilder,
    private service: PersonService,
  ) {}
}
