import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/auth.guard';

export const ofertasRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ofertas-list/ofertas-list.component').then(m => m.OfertasListComponent)
  },
  {
    path: 'nuevo',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./oferta-form/oferta-form.component').then(m => m.OfertaFormComponent)
  },
  {
    path: ':id/editar',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./oferta-form/oferta-form.component').then(m => m.OfertaFormComponent)
  }
];
