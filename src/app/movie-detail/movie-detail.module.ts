import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { MovieDetailPage } from './movie-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MovieDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    MovieDetailPage // ✅ Importa el standalone aquí
  ]
})
export class MovieDetailPageModule {}
