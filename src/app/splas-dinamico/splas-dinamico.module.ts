import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SplasDinamicoPageRoutingModule } from './splas-dinamico-routing.module';

import { SplasDinamicoPage } from './splas-dinamico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplasDinamicoPageRoutingModule
  ],
  declarations: [SplasDinamicoPage]
})
export class SplasDinamicoPageModule {}
