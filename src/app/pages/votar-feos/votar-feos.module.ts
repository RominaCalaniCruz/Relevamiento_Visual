import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VotarFeosPageRoutingModule } from './votar-feos-routing.module';

import { VotarFeosPage } from './votar-feos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VotarFeosPageRoutingModule
  ],
  declarations: [VotarFeosPage]
})
export class VotarFeosPageModule {}
