import {Routes} from "@angular/router";


export const recoverPasswordRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./recover-password.component').then(c => c.RecoverPasswordComponent),

  }
]
