import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartModulePageRoutingModule } from './cart-module-routing.module';

import { CartModulePage } from './cart-module.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartModulePageRoutingModule
  ],
  declarations: [CartModulePage]
})
export class CartModulePageModule {}
