import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./access/access.module').then( m => m.AccessPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'owner',
    loadChildren: () => import('./owner/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'employee',
    loadChildren: () => import('./employee/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'supplier',
    loadChildren: () => import('./supplier/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'store',
    loadChildren: () => import('./store/store.module').then( m => m.StorePageModule)
  },
  {
    path: 'cart-module',
    loadChildren: () => import('./store/cart-module/cart-module.module').then( m => m.CartModulePageModule)
  },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
