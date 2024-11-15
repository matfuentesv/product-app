import {Routes} from "@angular/router";


export const accountRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./account.component').then(c => c.AccountComponent),

  }
]
