import {Routes} from "@angular/router";


export const cartRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./cart.component').then(c => c.CartComponent),

  }
]
