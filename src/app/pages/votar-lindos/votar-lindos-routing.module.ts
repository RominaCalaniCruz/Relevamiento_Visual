import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VotarLindosPage } from './votar-lindos.page';

const routes: Routes = [
  {
    path: '',
    component: VotarLindosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VotarLindosPageRoutingModule {}
