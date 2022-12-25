import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShiftTradePageRoutingModule } from './shift-trade-routing.module';

import { ShiftTradePage } from './shift-trade.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShiftTradePageRoutingModule
  ],
  declarations: [ShiftTradePage]
})
export class ShiftTradePageModule {}
