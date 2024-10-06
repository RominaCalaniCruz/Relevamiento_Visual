import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splas-dinamico',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'splas-dinamico',
    loadChildren: () => import('./splas-dinamico/splas-dinamico.module').then( m => m.SplasDinamicoPageModule)
  },
  {
    path: 'listado-fotos',
    loadChildren: () => import('./pages/listado-fotos/listado-fotos.module').then( m => m.ListadoFotosPageModule)
  },
  {
    path: 'graficos',
    loadChildren: () => import('./pages/graficos/graficos.module').then( m => m.GraficosPageModule)
  },
  {
    path: 'votar-lindos',
    loadChildren: () => import('./pages/votar-lindos/votar-lindos.module').then( m => m.VotarLindosPageModule)
  },
  {
    path: 'votar-feos',
    loadChildren: () => import('./pages/votar-feos/votar-feos.module').then( m => m.VotarFeosPageModule)
  },
  {
    path: 'mis-fotos',
    loadChildren: () => import('./mis-fotos/mis-fotos.module').then( m => m.MisFotosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
