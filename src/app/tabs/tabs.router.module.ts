import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../services/auth-route-guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'list',
        canActivate: [AuthGuardService],
        children: [
          {
            path: '',
            loadChildren: '../listTab/listTab.module#ListTabModule'
          }
        ]
      },
    {
      path: 'home',
      children: [
        {
          path: '',
          loadChildren: '../homeTab/homeTab.module#HomeTabModule'
        }
      ]
    },
    {
      path: '',
      redirectTo: '/tabs/home',
      pathMatch: 'full'
    }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
