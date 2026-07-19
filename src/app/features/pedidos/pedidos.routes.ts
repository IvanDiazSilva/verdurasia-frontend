import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/auth.guard';

export const pedidosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pedidos-list/pedidos-list.component').then(m => m.PedidosListComponent)
  },
  {
    path: 'nuevo',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pedido-form/pedido-form.component').then(m => m.PedidoFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pedido-detalle/pedido-detalle.component').then(m => m.PedidoDetalleComponent)
  }
];
