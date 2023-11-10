import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './project.component';
import { WanderschaftComponent } from './wanderschaft/wanderschaft.component';
import { InfoComponent } from './info/info.component';
import { FotoalbumComponent } from './fotoalbum/fotoalbum.component';
import { PresseComponent } from './presse/presse.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    children: [
      {
        path: 'info',
        component: InfoComponent,
      },
      {
        path: 'wanderschaft',
        component: WanderschaftComponent,
      },
      {
        path: 'fotos',
        component: FotoalbumComponent,
      },
      {
        path: 'presse',
        component: PresseComponent,
      },
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  declarations: [
    ProjectComponent,
    WanderschaftComponent,
    InfoComponent,
    WanderschaftComponent,
    FotoalbumComponent,
    PresseComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ProjectModule {}