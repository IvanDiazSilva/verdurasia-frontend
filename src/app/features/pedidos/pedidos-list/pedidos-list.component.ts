import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido.service';
import { PedidoStateService } from '../../../core/services/pedido-state.service';
import {
  Pedido,
  EstadoPedido,
  ESTADO_LABEL,
  ESTADOS_PEDIDO,
} from '../../../core/models/pedido.model';
import { Page } from '../../../core/models/page.model';
import { AuthService } from '../../../core/services/auth.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ListStateComponent } from '../../../shared/components/list-state/list-state.component';

@Component({
  selector: 'app-pedidos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationComponent, ListStateComponent],
  template: `
    <div class="page-header">
      <h2 class="page-title">Pedidos</h2>
      @if (auth.isAdmin()) {
        <a routerLink="nuevo" class="btn btn--primary">+ Nuevo pedido</a>
      }
    </div>

    <!-- Filtro por estado -->
    <div class="filters">
      <select class="select-filtro" (change)="onFiltroEstado($event)">
        <option value="">Todos los estados</option>
        @for (e of estados(); track e) {
          <option [value]="e" [selected]="e === estadoFiltro()">{{ etiqueta(e) }}</option>
        }
      </select>
    </div>

    <app-list-state
      [cargando]="cargando()"
      [error]="error()"
      [vacio]="page()?.content?.length === 0"
      [mensajeVacio]="estadoFiltro() ? 'No hay pedidos con ese estado.' : 'No hay pedidos registrados.'"
    />

    @if (!cargando() && !error() && (page()?.content?.length ?? 0) > 0) {
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th class="text-right">Total</th>
              <th>Líneas</th>
              <th>Fecha</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (p of page()!.content; track p.id) {
              <tr>
                <td class="td--id">{{ p.id }}</td>
                <td class="td--nombre">{{ p.clienteNombre }}</td>
                <td>
                  @if (guardandoEstado() === p.id) {
                    <span class="estado-guardando">Guardando...</span>
                  } @else if (auth.isAdmin() && cambiandoEstado() === p.id) {
                    <select
                      class="select-estado"
                      [value]="p.estado"
                      (change)="onCambioEstado(p, $event)"
                      (blur)="cambiandoEstado.set(null)"
                    >
                      @for (e of estados(); track e) {
                        <option [value]="e">{{ etiqueta(e) }}</option>
                      }
                    </select>
                  } @else {
                    <span
                      class="badge"
                      [ngClass]="'badge--' + p.estado"
                      [style.cursor]="auth.isAdmin() ? 'pointer' : 'default'"
                      [title]="auth.isAdmin() ? 'Clic para cambiar estado' : ''"
                      (click)="auth.isAdmin() && cambiandoEstado.set(p.id)"
                    >
                      {{ etiqueta(p.estado) }}
                    </span>
                    @if (errorEstadoId() === p.id) {
                      <div class="estado-error">{{ errorEstadoMsg() }}</div>
                    }
                  }
                </td>
                <td class="text-right">{{ p.total | number:'1.2-2' }} S/</td>
                <td>{{ p.items.length }} artículo{{ p.items.length === 1 ? '' : 's' }}</td>
                <td class="td--fecha">{{ p.createdAt | date:'dd/MM/yyyy' }}</td>
                <td class="td--actions">
                  <a [routerLink]="[p.id]" class="btn btn--ghost btn--sm" title="Ver detalle">Ver</a>
                  @if (auth.isAdmin()) {
                    <button
                      class="btn btn--ghost btn--sm btn--danger"
                      (click)="eliminar(p)"
                      title="Eliminar"
                    >✕</button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <app-pagination [page]="page()!" itemLabel="pedidos" (pageChange)="cambiarPagina($event)" />
    }
  `,
  styles: [`
    .filters { margin-bottom: 1rem; }
    .select-filtro {
      padding: 0.4rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.875rem;
      background: #fff;
      color: #374151;
      cursor: pointer;
      outline: none;
      transition: border-color 0.15s;
    }
    .select-filtro:focus { border-color: #2d6a4f; }
    .td--id { color: #9ca3af; font-size: 0.8rem; font-weight: 500; }
    .td--fecha { color: #6b7280; font-size: 0.82rem; white-space: nowrap; }
    .estado-guardando {
      font-size: 0.78rem;
      color: #6b7280;
      font-style: italic;
      animation: pulso 1s ease-in-out infinite alternate;
    }
    @keyframes pulso {
      from { opacity: 1; }
      to   { opacity: 0.4; }
    }
    .estado-error {
      font-size: 0.75rem;
      color: #b91c1c;
      margin-top: 0.2rem;
    }
  `]
})
export class PedidosListComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  readonly auth = inject(AuthService);

  page            = signal<Page<Pedido> | null>(null);
  cargando        = signal(false);
  error           = signal<string | null>(null);
  paginaActual    = signal(0);
  estadoFiltro    = signal<EstadoPedido | undefined>(undefined);
  /** ID del pedido cuyo select de estado está abierto (null = ninguno). */
  cambiandoEstado = signal<number | null>(null);
  /** ID del pedido cuya petición PATCH está en vuelo (null = ninguna). */
  guardandoEstado = signal<number | null>(null);
  /** ID del pedido con error de cambio de estado (null = ninguno). */
  errorEstadoId   = signal<number | null>(null);
  /** Mensaje de error del último cambio de estado fallido. */
  errorEstadoMsg  = signal<string | null>(null);
  /** Lista de estados disponibles para los filtros y selects. */
  estados         = signal<EstadoPedido[]>(ESTADOS_PEDIDO);

  readonly pedidoStateService = inject(PedidoStateService);
  readonly etiqueta = (e: EstadoPedido) => ESTADO_LABEL[e];

  ngOnInit(): void {
    this.cargar();
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual.set(pagina);
    this.cargar();
  }

  onFiltroEstado(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;
    this.estadoFiltro.set(valor ? valor as EstadoPedido : undefined);
    this.paginaActual.set(0);
    this.cargar();
  }

  onCambioEstado(pedido: Pedido, event: Event): void {
    const nuevoEstado = (event.target as HTMLSelectElement).value as EstadoPedido;
    if (nuevoEstado === pedido.estado) {
      this.cambiandoEstado.set(null);
      return;
    }

    // Validar el cambio de estado usando el servicio unificado
    const validacion = this.pedidoStateService.validarCambio(pedido.estado, nuevoEstado);
    if (!validacion.valido) {
      this.guardandoEstado.set(null);
      this.cambiandoEstado.set(null);
      this.errorEstadoId.set(pedido.id);
      this.errorEstadoMsg.set(validacion.mensaje ?? 'No se puede cambiar el estado.');
      return;
    }

    // Limpiar error previo y activar spinner de guardado
    this.errorEstadoId.set(null);
    this.errorEstadoMsg.set(null);
    this.guardandoEstado.set(pedido.id);

    this.pedidoService.cambiarEstado(pedido.id, { estado: nuevoEstado }).subscribe({
      next: () => {
        this.guardandoEstado.set(null);
        this.cambiandoEstado.set(null);
        this.cargar();
      },
      error: (e) => {
        this.guardandoEstado.set(null);
        this.cambiandoEstado.set(null);
        this.errorEstadoId.set(pedido.id);
        this.errorEstadoMsg.set(e.message ?? 'Error al cambiar el estado.');
      }
    });
  }

  eliminar(p: Pedido): void {
    if (!confirm(`¿Eliminar el pedido #${p.id} de "${p.clienteNombre}"? Esta acción no se puede deshacer.`)) return;
    this.pedidoService.eliminar(p.id).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(e.message ?? 'Error al eliminar el pedido.')
    });
  }

  private cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.pedidoService.listar(this.paginaActual(), 20, this.estadoFiltro()).subscribe({
      next: (data) => {
        this.page.set(data);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(e.message ?? 'Error al cargar pedidos.');
        this.cargando.set(false);
      }
    });
  }
}
