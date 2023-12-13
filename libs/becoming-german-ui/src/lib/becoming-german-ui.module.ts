import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { NavComponent } from './nav/nav.component';
import { RequestComponent } from './request/request.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResultComponent } from './result/result.component';
import { StandardLayoutComponent } from './standard-layout/standard-layout.component';
import { FooterComponent } from './footer/footer.component';
import { I18nModule } from './i18n';
import { SpendenComponent } from './spenden/spenden.component';
import { ItemComponent } from './result/items/item.component';
import { HolidaysComponent } from './result/items/holidays.component';
import { SongComponent } from './result/items/song.component';
import { BookComponent } from './result/items/book.component';
import { GrandparentsComponent } from './result/items/grandparents.component';
import { MemoryComponent } from './result/items/memory.component';
import { PartyComponent } from './result/items/party.component';
import { AudiobookComponent } from './result/items/audiobook.component';
import { StartComponent } from './start/start.component';
import { SpendenHomeComponent } from './spenden/item/spenden-home.component';
import { SpendenItemComponent } from './spenden/item/spenden-item.component';
import { SpendenDankeComponent } from './spenden/item/spenden-danke.component';
import { OptionsComponent } from './form/options.component';


export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'start',
    component: StartComponent,
  },
  {
    path: '',
    component: StandardLayoutComponent,
    children: [
      {
        path: 'project',
        loadChildren: () => import('./project/project.module').then((m) => m.ProjectModule),
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
      {
        path: 'request/result',
        component: ResultComponent,
      },
      {
        path: 'spenden',
        loadChildren: () => import('./spenden/spenden.module').then((m) => m.SpendenModule),
      },
      {
        path: 'spenden-home',
        component: SpendenHomeComponent,
      },
      {
        path: 'spenden/spenden-item',
        component: SpendenItemComponent,
      },
      {
        path: 'spenden/spenden-danke',
        component: SpendenDankeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(appRoutes), ReactiveFormsModule, NgOptimizedImage],
  declarations: [
    HomeComponent,
    NewsComponent,
    ContactComponent,
    AboutComponent,
    NavComponent,
    RequestComponent,
    ResultComponent,
    HomeComponent,
    StandardLayoutComponent,
    FooterComponent,
    SpendenComponent,
    ItemComponent,
    BookComponent,
    GrandparentsComponent,
    HolidaysComponent,
    SongComponent,
    MemoryComponent,
    PartyComponent,
    AudiobookComponent,
    StartComponent,
  ],
  exports: [NavComponent, BookComponent, MemoryComponent, GrandparentsComponent],
  providers: [I18nModule.setLocale(), I18nModule.setLocaleId()],
})
export class LibsBecomingGermanUiModule {}
