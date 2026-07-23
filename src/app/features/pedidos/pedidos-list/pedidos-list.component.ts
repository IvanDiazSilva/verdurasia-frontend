import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido.service';
import {
  Pedido,
  EstadoPedido,
  ESTADOS_PEDIDO,
  ESTADO_LABEL,
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

    <app-list-state
      [cargando]="cargando()"
      [error]="error()"
      [vacio]="page()?.content?.length === 0"
      mensajeVacio="No hay pedidos registrados."
    />

    @if (!cargando() && !error() && page()?.content?.length! > 0) {
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
                  @if (auth.isAdmin() && cambiandoEstado() === p.id) {
                    <select
                      class="select-estado"
                      [value]="p.estado"
                      (change)="onCambioEstado(p, $event)"
                      (blur)="cambiandoEstado.set(null)"
                    >
                      @for (e of estados; track e) {
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
                  }
                </td>
                <td class="text-right">{{ p.total | number:'1.2-2' }} €</td>
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


    .td--id { color: #9ca3af; font-size: 0.8rem; font-weight: 500; }
    .td--fecha { color: #6b7280; font-size: 0.82rem; white-space: nowrap; }

    /* Estado badges */
    .badge--PENDIENTE      { background: #fef3c7; color: #92400e; }
    .badge--CONFIRMADO     { background: #dbeafe; color: #1e40af; }
    .badge--EN_PREPARACION { background: #ede9fe; color: #5b21b6; }
    .badge--ENVIADO        { background: #d1fae5; color: #065f46; }
    .badge--ENTREGADO      { background: #d1fae5; color: #065f46; }
    .badge--CANCELADO      { background: #fee2e2; color: #991b1b; }

    .select-estado {
      padding: 0.2rem 0.4rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.8rem;
      outline: none;
      background: #fff;
    }
    .select-estado:focus { border-color: #2d6a4f; }


  `]
})
export class PedidosListComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  readonly auth = inject(AuthService);

  page         = signal<Page<Pedido> | null>(null);
  cargando     = signal(false);
  error        = signal<string | null>(null);
  paginaActual = signal(0);
  /** ID del pedido cuyo estado se está editando inline (null = ninguno). */
  cambiandoEstado = signal<number | null>(null);

  readonly estados = ESTADOS_PEDIDO;
  readonly etiqueta = (e: EstadoPedido) => ESTADO_LABEL[e];

  ngOnInit(): void {
    this.cargar();
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual.set(pagina);
    this.cargar();
  }

  onCambioEstado(pedido: Pedido, event: Event): void {
    const nuevoEstado = (event.target as HTMLSelectElement).value as EstadoPedido;
    if (nuevoEstado === pedido.estado) {
      this.cambiandoEstado.set(null);
      return;
    }
    this.pedidoService.cambiarEstado(pedido.id, { estado: nuevoEstado }).subscribe({
      next: () => {
        this.cambiandoEstado.set(null);
        this.cargar();
      },
      error: (e) => {
        this.error.set(e.message ?? 'Error al cambiar el estado del pedido.');
        this.cambiandoEstado.set(null);
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
    this.pedidoService.listar(this.paginaActual(), 20).subscribe({
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
