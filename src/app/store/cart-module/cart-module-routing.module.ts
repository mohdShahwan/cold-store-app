import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartModulePage } from './cart-module.page';

const routes: Routes = [
  {
    path: '',
    component: CartModulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartModulePageRoutingModule {}
