import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OfertaService } from '../../../core/services/oferta.service';
import { Oferta, TIPO_OFERTA_LABEL } from '../../../core/models/oferta.model';
import { Page } from '../../../core/models/page.model';
import { AuthService } from '../../../core/services/auth.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ListStateComponent } from '../../../shared/components/list-state/list-state.component';

@Component({
  selector: 'app-ofertas-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationComponent, ListStateComponent],
  template: `
    <div class="page-header">
      <h2 class="page-title">Ofertas</h2>
      @if (auth.isAdmin()) {
        <a routerLink="nuevo" class="btn btn--primary">+ Nueva oferta</a>
      }
    </div>

    <app-list-state
      [cargando]="cargando()"
      [error]="error()"
      [vacio]="page()?.content?.length === 0"
      mensajeVacio="No hay ofertas registradas."
    />

    @if (!cargando() && !error() && page()?.content?.length! > 0) {
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th class="text-right">Descuento</th>
              <th>Producto</th>
              <th>Desde</th>
              <th>Hasta</th>
              <th>Vigencia</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (o of page()!.content; track o.id) {
              <tr>
                <td class="td--nombre">{{ o.nombre }}</td>
                <td>
                  <span class="tipo-label">{{ tipoLabel(o) }}</span>
                </td>
                <td class="text-right td--descuento">
                  {{ o.descuento }}{{ o.tipo === 'PORCENTAJE' ? '%' : ' €' }}
                </td>
                <td>{{ o.productoNombre ?? '— Global —' }}</td>
                <td class="td--fecha">{{ o.fechaInicio | date:'dd/MM/yyyy' }}</td>
                <td class="td--fecha">{{ o.fechaFin | date:'dd/MM/yyyy' }}</td>
                <td>
                  <span class="badge" [ngClass]="vigenciaBadgeClass(o)">
                    {{ vigenciaLabel(o) }}
                  </span>
                </td>
                <td>
                  <span class="badge" [class.badge--activo]="o.activa" [class.badge--inactivo]="!o.activa">
                    {{ o.activa ? 'Activa' : 'Inactiva' }}
                  </span>
                </td>
                <td class="td--actions">
                  @if (auth.isAdmin()) {
                    <a [routerLink]="[o.id, 'editar']" class="btn btn--ghost btn--sm" title="Editar">Editar</a>
                    <button
                      class="btn btn--ghost btn--sm btn--danger"
                      (click)="eliminar(o)"
                      title="Eliminar"
                    >✕</button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <app-pagination [page]="page()!" itemLabel="ofertas" (pageChange)="cambiarPagina($event)" />
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
    .table tbody tr:last-child td { border-bottom: none; }
    .table tbody tr:hover { background: #f9fafb; }

    .td--nombre { font-weight: 500; }
    .td--fecha { color: #6b7280; font-size: 0.82rem; white-space: nowrap; }
    .td--descuento { font-weight: 600; color: #1a1a1a; }
    .td--actions { display: flex; gap: 0.4rem; align-items: center; }
    .text-right { text-align: right; }

    .tipo-label {
      font-size: 0.78rem;
      color: #6b7280;
      background: #f3f4f6;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      white-space: nowrap;
    }

    .badge {
      display: inline-block;
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .badge--activo   { background: #d1fae5; color: #065f46; }
    .badge--inactivo { background: #fee2e2; color: #991b1b; }
    .badge--vigente  { background: #d1fae5; color: #065f46; }
    .badge--futura   { background: #dbeafe; color: #1e40af; }
    .badge--expirada { background: #f3f4f6; color: #6b7280; }

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
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn--primary  { background: #2d6a4f; color: #fff; }
    .btn--primary:hover { background: #1b4332; }
    .btn--ghost { background: transparent; border: 1px solid #d1d5db; color: #374151; }
    .btn--ghost:hover { background: #f3f4f6; }
    .btn--danger:hover { border-color: #ef4444; color: #ef4444; background: #fee2e2; }
    .btn--sm { padding: 0.3rem 0.65rem; font-size: 0.8rem; }
  `]
})
export class OfertasListComponent implements OnInit {
  private readonly ofertaService = inject(OfertaService);
  readonly auth = inject(AuthService);

  page         = signal<Page<Oferta> | null>(null);
  cargando     = signal(false);
  error        = signal<string | null>(null);
  paginaActual = signal(0);

  ngOnInit(): void {
    this.cargar();
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual.set(pagina);
    this.cargar();
  }

  tipoLabel(o: Oferta): string {
    return TIPO_OFERTA_LABEL[o.tipo];
  }

  /** Determina si la oferta está vigente, futura o expirada según fechas (independiente del flag activa). */
  vigenciaLabel(o: Oferta): string {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const inicio = new Date(o.fechaInicio);
    const fin    = new Date(o.fechaFin);
    if (hoy < inicio) return 'Futura';
    if (hoy > fin)    return 'Expirada';
    return 'Vigente';
  }

  vigenciaBadgeClass(o: Oferta): string {
    const label = this.vigenciaLabel(o);
    if (label === 'Vigente')  return 'badge--vigente';
    if (label === 'Futura')   return 'badge--futura';
    return 'badge--expirada';
  }

  eliminar(o: Oferta): void {
    if (!confirm(`¿Eliminar la oferta "${o.nombre}"? Esta acción no se puede deshacer.`)) return;
    this.ofertaService.eliminar(o.id).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(e.message ?? 'Error al eliminar la oferta.')
    });
  }

  private cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.ofertaService.listar(this.paginaActual(), 20).subscribe({
      next: (data) => {
        this.page.set(data);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(e.message ?? 'Error al cargar ofertas.');
        this.cargando.set(false);
      }
    });
  }
}
