import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoFotosPage } from './listado-fotos.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoFotosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoFotosPageRoutingModule {}
