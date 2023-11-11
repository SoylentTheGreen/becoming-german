import { Component } from '@angular/core';
import { ItemComponent } from './item.component';
import { AudioBook } from '@becoming-german/model';

@Component({
  selector: 'bgn-audiobook',
  templateUrl: './audiobook.component.html',
})
export class AudiobookComponent extends ItemComponent<AudioBook>{}
