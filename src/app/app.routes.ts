import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modules/pages/pages.component').then(c => c.PagesComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'home',
        loadChildren: () => import('./modules/pages/home').then(r => r.homeRoutes)
      },
      {
        path: 'notebooks',
        loadChildren: () => import('./modules/pages/categories/notebooks').then(r => r.notebooksRoutes)
      },
      {
        path: 'cell-phones',
        loadChildren: () => import('./modules/pages/categories/cell-phones').then(r => r.cellPhonesRoutes)
      },
      {
        path: 'coffee-makers',
        loadChildren: () => import('./modules/pages/categories/coffee-makers').then(r => r.coffeeMakersRoutes)
      },
      {
        path: 'air-conditioning',
        loadChildren: () => import('./modules/pages/categories/air-conditioning').then(r => r.appAirConditioningRoutes)
      },
      {
        path: 'admin',
        loadChildren: () => import('./modules/pages/admin').then(r => r.adminRoutes)
      },
      {
        path: 'account',
        loadChildren: () => import('./modules/pages/account').then(r => r.accountRoutes)
      },
      {
        path: 'cart',
        loadChildren: () => import('./modules/pages/cart').then(r => r.cartRoutes)
      },
      {
        path: 'recover-password',
        loadChildren: () => import('./modules/pages/recover-password').then(r => r.recoverPasswordRoutes)
      },
      {
        path: 'register',
        loadChildren: () => import('./modules/pages/register').then(r => r.registerRoutes)
      }
    ]
  }
];
