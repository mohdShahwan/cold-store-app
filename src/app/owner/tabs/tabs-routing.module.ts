import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'store',
        loadChildren: () => import('../store/store.module').then(m => m.StorePageModule)
      },
      {
        path: 'employees',
        loadChildren: () => import('../employees/employees.module').then(m => m.EmployeesPageModule)
      },
      {
        path: 'trade-requests',
        loadChildren: () => import('../trade-requests/trade-requests.module').then(m => m.TradeRequestsPageModule)
      },
      {
        path: 'schedule',
        loadChildren: () => import('../schedule/schedule.module').then(m => m.SchedulePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: '',
        redirectTo: 'store',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'store',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
