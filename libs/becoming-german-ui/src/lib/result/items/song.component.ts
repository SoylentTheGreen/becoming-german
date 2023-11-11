import { Component, ViewEncapsulation } from '@angular/core';
import { ItemComponent } from './item.component';
import { Song } from '@becoming-german/model';

@Component({
  selector: 'bgn-song',
  templateUrl: './song.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SongComponent extends ItemComponent<Song>{}
