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
        path: 'employees',
        loadChildren: () => import('../employees/employees.module').then(m => m.EmployeesPageModule)
      },
      {
        path: 'schedule',
        loadChildren: () => import('../schedule/schedule.module').then(m => m.SchedulePageModule)
      },
      {
        path: 'trade-requests',
        loadChildren: () => import('../trade-requests/trade-requests.module').then(m => m.TradeRequestsPageModule)
      },
      {
        path: 'order',
        loadChildren: () => import('../order/order.module').then( m => m.OrderPageModule)
      },
      {
        path: 'items',
        loadChildren: () => import('../items/items.module').then(m => m.ItemsPageModule)
      },
      {
        path: '',
        redirectTo: 'owner/tabs',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'owner/tabs',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
