import {Routes} from "@angular/router";


export const coffeeMakersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./coffee-makers.component').then(c => c.CoffeeMakersComponent),

  }
]
