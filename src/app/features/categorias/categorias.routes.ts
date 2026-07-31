import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/auth.guard';

export const categoriasRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./categorias-list/categorias-list.component').then(m => m.CategoriasListComponent)
  },
  {
    path: 'nuevo',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./categoria-form/categoria-form.component').then(m => m.CategoriaFormComponent)
  },
  {
    path: ':id/editar',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./categoria-form/categoria-form.component').then(m => m.CategoriaFormComponent)
  }
];
