import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VotarFeosPage } from './votar-feos.page';

const routes: Routes = [
  {
    path: '',
    component: VotarFeosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VotarFeosPageRoutingModule {}
