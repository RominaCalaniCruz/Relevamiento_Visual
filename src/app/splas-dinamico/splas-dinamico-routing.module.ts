import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplasDinamicoPage } from './splas-dinamico.page';

const routes: Routes = [
  {
    path: '',
    component: SplasDinamicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplasDinamicoPageRoutingModule {}
