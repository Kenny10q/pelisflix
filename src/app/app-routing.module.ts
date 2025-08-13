import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'tab1',
    loadChildren: () =>
      import('./tab1/tab1.module').then(m => m.Tab1PageModule)
  },
  {
  path: 'movie-detail/:id',
  loadComponent: () =>
    import('./movie-detail/movie-detail.page').then(m => m.MovieDetailPage)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
