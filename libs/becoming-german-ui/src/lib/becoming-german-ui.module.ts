import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Routes } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { ProjectComponent } from './project/project.component';
import { NewsComponent } from './news/news.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { NavComponent } from './nav/nav.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'project',
    component: ProjectComponent,
  },
  {
    path: 'news',
    component: NewsComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
];
@NgModule({
  imports: [CommonModule, RouterLink, RouterLinkActive],
  declarations: [
    HomeComponent,
    ProjectComponent,
    NewsComponent,
    ContactComponent,
    AboutComponent,
    NavComponent,
  ],
  exports: [NavComponent],
})
export class LibsBecomingGermanUiModule {}
