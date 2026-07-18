import { Routes } from '@angular/router';

export const ofertasRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ofertas-list/ofertas-list.component').then(m => m.OfertasListComponent)
  }
];
