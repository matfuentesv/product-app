import {Routes} from "@angular/router";


export const cellPhonesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./cell-phones.component').then(c => c.CellPhonesComponent),

  }
]
