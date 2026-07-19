import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/auth.guard';

export const productosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./productos-list/productos-list.component').then(m => m.ProductosListComponent)
  },
  {
    path: 'nuevo',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./producto-form/producto-form.component').then(m => m.ProductoFormComponent)
  },
  {
    path: ':id/editar',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./producto-form/producto-form.component').then(m => m.ProductoFormComponent)
  }
];
