import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StorePage } from './store.page';

const routes: Routes = [
  {
    path: '',
    component: StorePage,
    children: [
      {
        path: 'items',
        loadChildren: () => import('../items/items.module').then( m => m.ItemsPageModule)
      },
      {
        path: 'order',
        loadChildren: () => import('../order/order.module').then( m => m.OrderPageModule)
      },
      {
        path: 'stock',
        loadChildren: () => import('../stock/stock.module').then( m => m.StockPageModule)
      },
      {
        path: '',
        redirectTo: 'stock',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: 'stock',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorePageRoutingModule {}
