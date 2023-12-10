import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Song } from '@becoming-german/model';
import { fpFormGroup } from '@becoming-german/tools';
import { PersonService } from '../../person.service';

@Component({
  selector: 'bgn-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss','../item/spenden-item.component.scss'],
})
export class SongComponent {
  form = this.fb.group(fpFormGroup(Song.props));

  constructor(
    private fb: FormBuilder,
    private service: PersonService,
  ) {}
}

