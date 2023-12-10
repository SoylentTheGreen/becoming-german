import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PersonService } from '../../person.service';
import * as E from 'fp-ts/Either';

@Component({
  selector: 'bgn-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.scss','../item/spenden-item.component.scss'],
})
export class MemoryComponent {

  memory = new FormControl('', [Validators.required]);
  sub = this.service.donation.subscribe((s) =>
    console.log(E.isRight(s) ? s.right.state : s.left.state)
  );
  constructor(
    private service: PersonService
  ) {}

  async update() {
    if(this.memory.invalid) return;
    const result = await this.service.addItem('memory', this.memory.getRawValue())();
    if(E.isLeft(result)) console.log('bad luck updating the memory');
    else console.log('we go a result from the service of', result.right);
  }
}
