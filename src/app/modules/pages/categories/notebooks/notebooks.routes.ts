import {Routes} from "@angular/router";


export const notebooksRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./notebooks.component').then(c => c.NotebooksComponent),

  }
]
