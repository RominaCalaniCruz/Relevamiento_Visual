import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoFotosPageRoutingModule } from './listado-fotos-routing.module';

import { ListadoFotosPage } from './listado-fotos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoFotosPageRoutingModule
  ],
  declarations: [ListadoFotosPage]
})
export class ListadoFotosPageModule {}
