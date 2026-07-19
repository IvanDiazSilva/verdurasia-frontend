import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/auth.guard';

export const clientesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./clientes-list/clientes-list.component').then(m => m.ClientesListComponent)
  },
  {
    path: 'nuevo',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./cliente-form/cliente-form.component').then(m => m.ClienteFormComponent)
  },
  {
    path: ':id/editar',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./cliente-form/cliente-form.component').then(m => m.ClienteFormComponent)
  }
];
