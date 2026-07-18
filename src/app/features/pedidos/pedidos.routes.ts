import { Routes } from '@angular/router';

export const pedidosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pedidos-list/pedidos-list.component').then(m => m.PedidosListComponent)
  }
];
