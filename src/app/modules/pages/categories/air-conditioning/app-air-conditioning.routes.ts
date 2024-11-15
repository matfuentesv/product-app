import {Routes} from "@angular/router";


export const appAirConditioningRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./air-conditioning.component').then(c => c.AirConditioningComponent),

  }
]
