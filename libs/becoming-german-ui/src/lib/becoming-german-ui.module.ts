import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProjectComponent } from './project/project.component';
import { NewsComponent } from './news/news.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { NavComponent } from './nav/nav.component';
import { RequestComponent } from './request/request.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResultComponent } from './result/result.component';
import { StandardLayoutComponent } from './standard-layout/standard-layout.component';
import { WanderschaftComponent } from './project/wanderschaft/wanderschaft.component';
import { FotoalbumComponent } from './project/fotoalbum/fotoalbum.component';
import { PresseComponent } from './project/presse/presse.component';
import { SecondaryNavComponent } from './project/secondary-nav/secondary-nav.component';
import { FooterComponent } from './footer/footer.component';
import { SecondaryNav2Component } from './project/secondary-nav2/secondary-nav2.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '',
    component: StandardLayoutComponent,
    children: [
      {
        path: 'project',
        component: ProjectComponent,
      },
      {
        path: 'project/wanderschaft',
        component: WanderschaftComponent,
      },
      {
        path: 'project/Fotoalbum',
        component: FotoalbumComponent,
      },
      {
        path: 'project/presse',
        component: PresseComponent,
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
      {
        path: 'request',
        component: RequestComponent,
      },
    ],
  },
];
@NgModule({
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule, RouterOutlet],
  declarations: [
    HomeComponent,
    ProjectComponent,
    NewsComponent,
    ContactComponent,
    AboutComponent,
    NavComponent,
    RequestComponent,
    ResultComponent,
    HomeComponent,
    StandardLayoutComponent,
    WanderschaftComponent,
    FotoalbumComponent,
    PresseComponent,
    SecondaryNavComponent,
    FooterComponent,
    SecondaryNav2Component,
  ],
  exports: [NavComponent, SecondaryNavComponent],
})
export class LibsBecomingGermanUiModule {}
