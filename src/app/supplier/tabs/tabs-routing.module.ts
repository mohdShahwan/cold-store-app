import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('../../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('../orders/orders.module').then(m => m.OrdersPageModule)
      },
      {
        path: '',
        redirectTo: 'orders',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    // supplier/orders
    redirectTo: 'orders',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
