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
        path: 'schedule',
        loadChildren: () => import('../schedule/schedule.module').then(m => m.SchedulePageModule)
      },
      {
        path: 'shifts-trade',
        loadChildren: () => import('../shift-trade/shift-trade.module').then(m => m.ShiftTradePageModule)
      },
      {
        path: '',
        redirectTo: 'employee/tabs/',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'employee/tabs/',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
