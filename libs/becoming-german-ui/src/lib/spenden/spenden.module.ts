import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookComponent } from './item/book.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes=[{path: 'book', component: BookComponent}];

@NgModule({
  declarations: [BookComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class SpendenModule { }
