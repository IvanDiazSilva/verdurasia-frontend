import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductoService } from '../../../core/services/producto.service';
import { Producto } from '../../../core/models/producto.model';
import { Page } from '../../../core/models/page.model';
import { AuthService } from '../../../core/services/auth.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ListStateComponent } from '../../../shared/components/list-state/list-state.component';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, PaginationComponent, ListStateComponent],
  template: `
    <div class="page-header">
      <h2 class="page-title">Productos</h2>
      @if (auth.isAdmin()) {
        <a routerLink="nuevo" class="btn btn--primary">+ Nuevo producto</a>
      }
    </div>

    <!-- Filtro de búsqueda -->
    <div class="filters">
      <input
        class="input"
        type="text"
        placeholder="Buscar por nombre..."
        [formControl]="busquedaCtrl"
      />
    </div>

    <!-- Estado de carga / error -->
    <app-list-state
      [cargando]="cargando()"
      [error]="error()"
      [vacio]="page()?.content?.length === 0"
      mensajeVacio="No hay productos registrados."
    />

    @if (!cargando() && !error() && page()?.content?.length! > 0) {
      <!-- Tabla -->
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Unidad</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (p of page()!.content; track p.id) {
              <tr>
                <td class="td--nombre">{{ p.nombre }}</td>
                <td>{{ p.categoriaNombre ?? '—' }}</td>
                <td>{{ p.precio | number:'1.2-2' }} €</td>
                <td>{{ p.stock }}</td>
                <td>{{ p.unidad }}</td>
                <td>
                  <span class="badge" [class.badge--activo]="p.activo" [class.badge--inactivo]="!p.activo">
                    {{ p.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="td--actions">
                  @if (auth.isAdmin()) {
                    <a [routerLink]="[p.id, 'editar']" class="btn btn--ghost btn--sm" title="Editar">Editar</a>
                    <button class="btn btn--ghost btn--sm btn--danger" (click)="eliminar(p)" title="Eliminar">✕</button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <app-pagination [page]="page()!" itemLabel="productos" (pageChange)="cambiarPagina($event)" />
    }
  `,
  styles: [`
    .filters { margin-bottom: 1rem; }
    .input {
      width: 280px;
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
    .text-right { text-align: right; }

    .badge {
      display: inline-block;
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge--activo  { background: #d1fae5; color: #065f46; }
    .badge--inactivo { background: #fee2e2; color: #991b1b; }

    .td--actions { display: flex; gap: 0.4rem; align-items: center; }
  `]
})
export class ProductosListComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  readonly auth = inject(AuthService);

  page    = signal<Page<Producto> | null>(null);
  cargando = signal(false);
  error    = signal<string | null>(null);
  paginaActual = signal(0);

  busquedaCtrl = new FormControl('');

  ngOnInit(): void {
    this.cargar();

    this.busquedaCtrl.valueChanges.pipe(
      debounceTime(350),
      distinctUntilChanged()
    ).subscribe(() => {
      this.paginaActual.set(0);
      this.cargar();
    });
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual.set(pagina);
    this.cargar();
  }

  eliminar(p: Producto): void {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    this.productoService.eliminar(p.id).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(e.message)
    });
  }

  private cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    const nombre = this.busquedaCtrl.value ?? undefined;
    this.productoService.listar(this.paginaActual(), 20, nombre || undefined).subscribe({
      next: (data) => {
        this.page.set(data);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(e.message ?? 'Error al cargar productos');
        this.cargando.set(false);
      }
    });
  }
}
