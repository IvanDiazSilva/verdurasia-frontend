import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],  // Protege todo el layout — requiere autenticación
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'clientes',
        loadChildren: () =>
          import('./features/clientes/clientes.routes').then(m => m.clientesRoutes)
      },
      {
        path: 'productos',
        loadChildren: () =>
          import('./features/productos/productos.routes').then(m => m.productosRoutes)
      },
      {
        path: 'pedidos',
        loadChildren: () =>
          import('./features/pedidos/pedidos.routes').then(m => m.pedidosRoutes)
      },
      {
        path: 'ofertas',
        loadChildren: () =>
          import('./features/ofertas/ofertas.routes').then(m => m.ofertasRoutes)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
