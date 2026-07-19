import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido.service';
import {
  Pedido,
  EstadoPedido,
  ESTADOS_PEDIDO,
  ESTADO_LABEL,
} from '../../../core/models/pedido.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-pedido-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h2 class="page-title">
        Pedido #{{ pedido()?.id ?? '...' }}
      </h2>
      <a routerLink="/pedidos" class="btn btn--ghost btn--sm">← Volver</a>
    </div>

    @if (cargando()) {
      <div class="state-msg">Cargando pedido...</div>
    } @else if (error()) {
      <div class="state-msg state-msg--error">{{ error() }}</div>
    } @else if (pedido()) {
      <!-- Cabecera del pedido -->
      <div class="card card--header">
        <div class="meta-grid">
          <div class="meta-item">
            <span class="meta-label">Cliente</span>
            <span class="meta-value">{{ pedido()!.clienteNombre }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Estado</span>
            <span class="meta-value">
              @if (auth.isAdmin() && cambiandoEstado()) {
                <select class="select-estado" (change)="onCambioEstado($event)" (blur)="cambiandoEstado.set(false)">
                  @for (e of estados; track e) {
                    <option [value]="e" [selected]="e === pedido()!.estado">{{ etiqueta(e) }}</option>
                  }
                </select>
              } @else {
                <span
                  class="badge"
                  [ngClass]="'badge--' + pedido()!.estado"
                  [style.cursor]="auth.isAdmin() ? 'pointer' : 'default'"
                  [title]="auth.isAdmin() ? 'Clic para cambiar estado' : ''"
                  (click)="auth.isAdmin() && cambiandoEstado.set(true)"
                >{{ etiqueta(pedido()!.estado) }}</span>
              }
            </span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Total</span>
            <span class="meta-value meta-value--total">{{ pedido()!.total | number:'1.2-2' }} €</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Fecha</span>
            <span class="meta-value">{{ pedido()!.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
        </div>

        @if (pedido()!.notas) {
          <div class="notas">
            <span class="meta-label">Notas</span>
            <p class="notas-text">{{ pedido()!.notas }}</p>
          </div>
        }

        @if (errorEstado()) {
          <div class="alert alert--error" style="margin-top:0.75rem">{{ errorEstado() }}</div>
        }
      </div>

      <!-- Líneas del pedido -->
      <h3 class="section-title">Líneas del pedido</h3>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th class="text-right">Cantidad</th>
              <th class="text-right">Precio unit.</th>
              <th class="text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            @for (item of pedido()!.items; track item.id) {
              <tr>
                <td class="td--nombre">{{ item.productoNombre }}</td>
                <td class="text-right">{{ item.cantidad }}</td>
                <td class="text-right">{{ item.precioUnit | number:'1.2-2' }} €</td>
                <td class="text-right td--subtotal">{{ item.subtotal | number:'1.2-2' }} €</td>
              </tr>
            }
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="tfoot-label">Total</td>
              <td class="text-right td--total">{{ pedido()!.total | number:'1.2-2' }} €</td>
            </tr>
          </tfoot>
        </table>
      </div>
    }
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }
    .page-title { font-size: 1.25rem; font-weight: 600; color: #1a1a1a; margin: 0; }

    .state-msg {
      padding: 2rem;
      text-align: center;
      color: #666;
      font-size: 0.9rem;
    }
    .state-msg--error { color: #c0392b; }

    .card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 1rem;
    }
    .meta-item { display: flex; flex-direction: column; gap: 0.2rem; }
    .meta-label { font-size: 0.75rem; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.03em; }
    .meta-value { font-size: 0.9rem; color: #111827; font-weight: 500; }
    .meta-value--total { font-size: 1.1rem; font-weight: 700; color: #2d6a4f; }

    .notas { margin-top: 1rem; }
    .notas-text { margin: 0.25rem 0 0; font-size: 0.875rem; color: #374151; }

    .alert {
      padding: 0.6rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
    }
    .alert--error { background: #fee2e2; color: #991b1b; border-left: 4px solid #ef4444; }

    .section-title { font-size: 1rem; font-weight: 600; color: #374151; margin: 0 0 0.75rem; }

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
    }
    .table td {
      padding: 0.65rem 1rem;
      border-bottom: 1px solid #f3f4f6;
      color: #374151;
    }
    .table tfoot td {
      padding: 0.65rem 1rem;
      border-top: 2px solid #e5e7eb;
      background: #f9fafb;
    }
    .table tbody tr:last-child td { border-bottom: none; }
    .td--nombre { font-weight: 500; }
    .td--subtotal { color: #374151; }
    .td--total { font-weight: 700; font-size: 0.95rem; color: #2d6a4f; }
    .tfoot-label { font-weight: 600; color: #374151; }
    .text-right { text-align: right; }

    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
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

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.15s, opacity 0.15s;
    }
    .btn--ghost { background: transparent; border: 1px solid #d1d5db; color: #374151; }
    .btn--ghost:hover { background: #f3f4f6; }
    .btn--sm { padding: 0.3rem 0.65rem; font-size: 0.8rem; }
  `]
})
export class PedidoDetalleComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  private readonly route         = inject(ActivatedRoute);
  readonly auth = inject(AuthService);

  pedido      = signal<Pedido | null>(null);
  cargando    = signal(false);
  error       = signal<string | null>(null);
  errorEstado = signal<string | null>(null);
  cambiandoEstado = signal(false);

  readonly estados = ESTADOS_PEDIDO;
  readonly etiqueta = (e: EstadoPedido) => ESTADO_LABEL[e];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar(id);
  }

  onCambioEstado(event: Event): void {
    const nuevoEstado = (event.target as HTMLSelectElement).value as EstadoPedido;
    const p = this.pedido();
    if (!p || nuevoEstado === p.estado) {
      this.cambiandoEstado.set(false);
      return;
    }
    this.pedidoService.cambiarEstado(p.id, { estado: nuevoEstado }).subscribe({
      next: (actualizado) => {
        this.pedido.set(actualizado);
        this.cambiandoEstado.set(false);
        this.errorEstado.set(null);
      },
      error: (e) => {
        this.errorEstado.set(e.message ?? 'Error al cambiar el estado.');
        this.cambiandoEstado.set(false);
      }
    });
  }

  private cargar(id: number): void {
    this.cargando.set(true);
    this.error.set(null);
    this.pedidoService.obtener(id).subscribe({
      next: (data) => {
        this.pedido.set(data);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(e.message ?? 'No se pudo cargar el pedido.');
        this.cargando.set(false);
      }
    });
  }
}
