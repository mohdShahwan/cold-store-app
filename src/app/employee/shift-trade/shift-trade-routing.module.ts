import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShiftTradePage } from './shift-trade.page';

const routes: Routes = [
  {
    path: '',
    component: ShiftTradePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShiftTradePageRoutingModule {}
