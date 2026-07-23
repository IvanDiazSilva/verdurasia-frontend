import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ClienteService } from '../../../core/services/cliente.service';
import { Cliente } from '../../../core/models/cliente.model';
import { Page } from '../../../core/models/page.model';
import { AuthService } from '../../../core/services/auth.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ListStateComponent } from '../../../shared/components/list-state/list-state.component';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, PaginationComponent, ListStateComponent],
  template: `
    <div class="page-header">
      <h2 class="page-title">Clientes</h2>
      @if (auth.isAdmin()) {
        <a routerLink="nuevo" class="btn btn--primary">+ Nuevo cliente</a>
      }
    </div>

    <!-- Filtro de búsqueda -->
    <div class="filters">
      <input
        class="input"
        type="text"
        placeholder="Buscar por nombre o email..."
        [formControl]="busquedaCtrl"
      />
    </div>

    <!-- Estado de carga / error -->
    <app-list-state
      [cargando]="cargando()"
      [error]="error()"
      [vacio]="clientesFiltrados().length === 0"
      [mensajeVacio]="busquedaCtrl.value ? 'No hay clientes que coincidan con la búsqueda.' : 'No hay clientes registrados.'"
    />

    @if (!cargando() && !error() && clientesFiltrados().length > 0) {
      <!-- Tabla -->
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (c of clientesFiltrados(); track c.id) {
              <tr>
                <td class="td--nombre">{{ c.nombre }}</td>
                <td>{{ c.email }}</td>
                <td>{{ c.telefono || '—' }}</td>
                <td class="td--direccion">{{ c.direccion || '—' }}</td>
                <td>
                  <span class="badge" [class.badge--activo]="c.activo" [class.badge--inactivo]="!c.activo">
                    {{ c.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="td--actions">
                  @if (auth.isAdmin()) {
                    <a [routerLink]="[c.id, 'editar']" class="btn btn--ghost btn--sm" title="Editar">Editar</a>
                    <button class="btn btn--ghost btn--sm btn--danger" (click)="eliminar(c)" title="Eliminar">✕</button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <app-pagination [page]="page()!" itemLabel="clientes" (pageChange)="cambiarPagina($event)" />
    }
  `,
  styles: [`
    .filters { margin-bottom: 1rem; }
    .input {
      width: 320px;
      padding: 0.45rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.875rem;
      outline: none;
      transition: border-color 0.15s;
    }
    .input:focus { border-color: #2d6a4f; }

    .table-wrapper {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    .table thead { background: #f9fafb; }
    .table th {
      padding: 0.65rem 1rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
      white-space: nowrap;
    }
    .table td {
      padding: 0.65rem 1rem;
      border-bottom: 1px solid #f3f4f6;
      color: #374151;
    }
    .table tbody tr:last-child td { border-bottom: none; }
    .table tbody tr:hover { background: #f9fafb; }
    .td--nombre { font-weight: 500; }
    .td--direccion {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .td--actions {
      display: flex;
      gap: 0.4rem;
      align-items: center;
    }

    .badge {
      display: inline-block;
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge--activo  { background: #d1fae5; color: #065f46; }
    .badge--inactivo { background: #fee2e2; color: #991b1b; }


  `]
})
export class ClientesListComponent implements OnInit {
  private readonly clienteService = inject(ClienteService);
  readonly auth = inject(AuthService);

  page         = signal<Page<Cliente> | null>(null);
  cargando     = signal(false);
  error        = signal<string | null>(null);
  paginaActual = signal(0);

  busquedaCtrl = new FormControl('');

  /** Filtrado client-side: la API de clientes no acepta parámetros de búsqueda. */
  clientesFiltrados = computed(() => {
    const todos = this.page()?.content ?? [];
    const termino = (this.busquedaCtrl.value ?? '').toLowerCase().trim();
    if (!termino) return todos;
    return todos.filter(c =>
      c.nombre.toLowerCase().includes(termino) ||
      c.email.toLowerCase().includes(termino)
    );
  });

  ngOnInit(): void {
    this.cargar();

    this.busquedaCtrl.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe(() => {
      // El filtrado es client-side; solo recargamos si la búsqueda se vacía
      // y aún no tenemos datos (para el caso de carga inicial fallida).
    });
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual.set(pagina);
    this.cargar();
  }

  eliminar(c: Cliente): void {
    if (!confirm(`¿Eliminar al cliente "${c.nombre}"? Esta acción no se puede deshacer.`)) return;
    this.clienteService.eliminar(c.id).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(e.message ?? 'Error al eliminar el cliente.')
    });
  }

  private cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.clienteService.listar(this.paginaActual(), 20).subscribe({
      next: (data) => {
        this.page.set(data);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(e.message ?? 'Error al cargar clientes.');
        this.cargando.set(false);
      }
    });
  }
}
