import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductoService } from '../../core/services/producto.service';
import { ClienteService } from '../../core/services/cliente.service';
import { PedidoService } from '../../core/services/pedido.service';
import { OfertaService } from '../../core/services/oferta.service';
import { Pedido, ESTADO_LABEL, EstadoPedido } from '../../core/models/pedido.model';
import { Oferta } from '../../core/models/oferta.model';

interface Tarjeta {
  titulo: string;
  valor: number | null;
  enlace: string;
  icono: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dash-header">
      <h2 class="page-title">Dashboard</h2>
      <span class="fecha">{{ hoy }}</span>
    </div>

    <!-- Tarjetas de resumen -->
    @if (cargando()) {
      <div class="state-msg">Cargando estadísticas...</div>
    } @else if (error()) {
      <div class="state-msg state-msg--error">{{ error() }}</div>
    } @else {
      <div class="tarjetas">
        @for (t of tarjetas(); track t.titulo) {
          <a [routerLink]="t.enlace" class="tarjeta" [style.--color]="t.color">
            <div class="tarjeta__icono">{{ t.icono }}</div>
            <div class="tarjeta__body">
              <div class="tarjeta__valor">{{ t.valor ?? '—' }}</div>
              <div class="tarjeta__titulo">{{ t.titulo }}</div>
            </div>
          </a>
        }
      </div>

      <!-- Últimos pedidos -->
      <section class="section">
        <div class="section__header">
          <h3 class="section__title">Últimos pedidos</h3>
          <a routerLink="/pedidos" class="link-ver-todos">Ver todos →</a>
        </div>

        @if (ultimosPedidos().length === 0) {
          <div class="state-msg">No hay pedidos registrados aún.</div>
        } @else {
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th class="text-right">Total</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                @for (p of ultimosPedidos(); track p.id) {
                  <tr>
                    <td class="td--id">{{ p.id }}</td>
                    <td class="td--nombre">{{ p.clienteNombre }}</td>
                    <td>
                      <span class="badge" [ngClass]="'badge--' + p.estado">
                        {{ estadoLabel(p.estado) }}
                      </span>
                    </td>
                    <td class="text-right">{{ p.total | number:'1.2-2' }} €</td>
                    <td class="td--fecha">{{ p.createdAt | date:'dd/MM/yyyy' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <!-- Ofertas vigentes -->
      <section class="section">
        <div class="section__header">
          <h3 class="section__title">Ofertas vigentes hoy</h3>
          <a routerLink="/ofertas" class="link-ver-todos">Ver todas →</a>
        </div>

        @if (ofertasVigentes().length === 0) {
          <div class="state-msg">No hay ofertas vigentes hoy.</div>
        } @else {
          <div class="ofertas-grid">
            @for (o of ofertasVigentes(); track o.id) {
              <div class="oferta-card">
                <div class="oferta-card__nombre">{{ o.nombre }}</div>
                <div class="oferta-card__descuento">
                  {{ o.descuento }}{{ o.tipo === 'PORCENTAJE' ? '%' : ' €' }} dto.
                </div>
                @if (o.productoNombre) {
                  <div class="oferta-card__producto">{{ o.productoNombre }}</div>
                } @else {
                  <div class="oferta-card__producto oferta-card__producto--global">Global</div>
                }
                <div class="oferta-card__fechas">
                  Hasta {{ o.fechaFin | date:'dd/MM/yyyy' }}
                </div>
              </div>
            }
          </div>
        }
      </section>
    }
  `,
  styles: [`
    .dash-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    .page-title { font-size: 1.25rem; font-weight: 600; color: #1a1a1a; margin: 0; }
    .fecha { font-size: 0.85rem; color: #9ca3af; }

    .state-msg {
      padding: 2rem;
      text-align: center;
      color: #666;
      font-size: 0.9rem;
    }
    .state-msg--error { color: #c0392b; }

    /* ---- Tarjetas ---- */
    .tarjetas {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .tarjeta {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-left: 4px solid var(--color, #2d6a4f);
      border-radius: 8px;
      padding: 1.1rem 1.25rem;
      text-decoration: none;
      transition: box-shadow 0.15s, transform 0.15s;
      cursor: pointer;
    }
    .tarjeta:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: translateY(-1px); }
    .tarjeta__icono { font-size: 1.6rem; line-height: 1; }
    .tarjeta__valor {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      line-height: 1;
    }
    .tarjeta__titulo {
      font-size: 0.8rem;
      color: #6b7280;
      margin-top: 0.2rem;
      font-weight: 500;
    }

    /* ---- Secciones ---- */
    .section { margin-bottom: 2rem; }
    .section__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    .section__title { font-size: 1rem; font-weight: 600; color: #374151; margin: 0; }
    .link-ver-todos { font-size: 0.825rem; color: #2d6a4f; text-decoration: none; }
    .link-ver-todos:hover { text-decoration: underline; }

    /* ---- Tabla últimos pedidos ---- */
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
      vertical-align: middle;
    }
    .text-right { text-align: right; }
    .table tbody tr:last-child td { border-bottom: none; }
    .table tbody tr:hover { background: #f9fafb; }
    .td--id { color: #9ca3af; font-size: 0.8rem; font-weight: 500; }
    .td--nombre { font-weight: 500; }
    .td--fecha { color: #6b7280; font-size: 0.82rem; white-space: nowrap; }

    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .badge--PENDIENTE      { background: #fef3c7; color: #92400e; }
    .badge--CONFIRMADO     { background: #dbeafe; color: #1e40af; }
    .badge--EN_PREPARACION { background: #ede9fe; color: #5b21b6; }
    .badge--ENVIADO        { background: #d1fae5; color: #065f46; }
    .badge--ENTREGADO      { background: #d1fae5; color: #065f46; }
    .badge--CANCELADO      { background: #fee2e2; color: #991b1b; }

    /* ---- Ofertas vigentes ---- */
    .ofertas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.75rem;
    }
    .oferta-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1rem;
    }
    .oferta-card__nombre { font-weight: 600; font-size: 0.875rem; color: #111827; margin-bottom: 0.35rem; }
    .oferta-card__descuento {
      font-size: 1.2rem;
      font-weight: 700;
      color: #2d6a4f;
      margin-bottom: 0.25rem;
    }
    .oferta-card__producto { font-size: 0.78rem; color: #6b7280; margin-bottom: 0.2rem; }
    .oferta-card__producto--global { color: #9ca3af; font-style: italic; }
    .oferta-card__fechas { font-size: 0.75rem; color: #9ca3af; }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly clienteService  = inject(ClienteService);
  private readonly pedidoService   = inject(PedidoService);
  private readonly ofertaService   = inject(OfertaService);

  tarjetas       = signal<Tarjeta[]>([]);
  ultimosPedidos = signal<Pedido[]>([]);
  ofertasVigentes = signal<Oferta[]>([]);
  cargando       = signal(true);
  error          = signal<string | null>(null);

  readonly hoy = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  readonly estadoLabel = (e: EstadoPedido) => ESTADO_LABEL[e];

  ngOnInit(): void {
    forkJoin({
      productos: this.productoService.listar(0, 1),
      clientes:  this.clienteService.listar(0, 1),
      pedidos:   this.pedidoService.listar(0, 5),
      vigentes:  this.ofertaService.vigentes(),
      ofertas:   this.ofertaService.listar(0, 1),
    }).subscribe({
      next: ({ productos, clientes, pedidos, vigentes, ofertas }) => {
        this.tarjetas.set([
          {
            titulo: 'Productos',
            valor:  productos.totalElements,
            enlace: '/productos',
            icono:  '🥦',
            color:  '#2d6a4f',
          },
          {
            titulo: 'Clientes',
            valor:  clientes.totalElements,
            enlace: '/clientes',
            icono:  '👤',
            color:  '#1e40af',
          },
          {
            titulo: 'Pedidos',
            valor:  pedidos.totalElements,
            enlace: '/pedidos',
            icono:  '📦',
            color:  '#92400e',
          },
          {
            titulo: 'Ofertas vigentes',
            valor:  vigentes.length,
            enlace: '/ofertas',
            icono:  '🏷️',
            color:  '#5b21b6',
          },
        ]);
        this.ultimosPedidos.set(pedidos.content);
        this.ofertasVigentes.set(vigentes);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(e.message ?? 'Error al cargar el dashboard.');
        this.cargando.set(false);
      }
    });
  }
}
