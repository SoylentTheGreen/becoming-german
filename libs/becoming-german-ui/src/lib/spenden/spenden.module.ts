import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookComponent } from './item/book.component';
import { RouterModule, Routes } from '@angular/router';
import { AudiobookComponent } from './item/audiobook.component';
import { GrandparentsComponent } from './item/grandparents.component';
import { HolidaysComponent } from './item/holidays.component';
import { MemoryComponent } from './item/memory.component';
import { PartyComponent } from './item/party.component';
import { SongComponent } from './item/song.component';
import { SpendenComponent } from './spenden.component';
import { SpendenHomeComponent } from './item/spenden-home.component';
import { OptionsComponent } from '../form/options.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CollapsibleComponent } from './item/collapsible.component';
import { PropertyInputComponent } from '../form/property-input.component';

const routes: Routes = [
  {
    path: '',
    component: SpendenComponent
  //   children: [
  //     { path: 'audiobook', component: AudiobookComponent },
  //     { path: 'book', component: BookComponent },
  //     { path: 'grandparents', component: GrandparentsComponent },
  //     { path: 'holidays', component: HolidaysComponent },
  //     { path: 'memory', component: MemoryComponent },
  //     { path: 'party', component: PartyComponent },
  //     { path: 'song', component: SongComponent },
  //     { path: '', component: SpendenHomeComponent },
  //   ],
  },
];

@NgModule({
  declarations: [
    BookComponent,
    AudiobookComponent,
    GrandparentsComponent,
    HolidaysComponent,
    MemoryComponent,
    PartyComponent,
    SongComponent,
    SpendenHomeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    OptionsComponent,
    ReactiveFormsModule,
    CollapsibleComponent,
    PropertyInputComponent,
  ],
})
export class SpendenModule {}

