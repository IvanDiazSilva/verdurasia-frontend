import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria.model';
import { Page } from '../../../core/models/page.model';
import { AuthService } from '../../../core/services/auth.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ListStateComponent } from '../../../shared/components/list-state/list-state.component';

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationComponent, ListStateComponent],
  template: `
    <div class="page-header">
      <h2 class="page-title">Categorías</h2>
      @if (auth.isAdmin()) {
        <a routerLink="nuevo" class="btn btn--primary">+ Nueva categoría</a>
      }
    </div>

    <!-- Estado de carga / error -->
    <app-list-state
      [cargando]="cargando()"
      [error]="error()"
      [vacio]="page()?.content?.length === 0"
      mensajeVacio="No hay categorías registradas."
    />

    @if (!cargando() && !error() && (page()?.content?.length ?? 0) > 0) {
      <!-- Tabla -->
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (c of page()!.content; track c.id) {
              <tr>
                <td class="td--nombre">{{ c.nombre }}</td>
                <td class="td--descripcion">{{ c.descripcion || '—' }}</td>
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
      <app-pagination [page]="page()!" itemLabel="categorías" (pageChange)="cambiarPagina($event)" />
    }
  `,
  styles: [`
    .td--descripcion {
      max-width: 360px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #6b7280;
    }
  `]
})
export class CategoriasListComponent implements OnInit {
  private readonly categoriaService = inject(CategoriaService);
  readonly auth = inject(AuthService);

  page         = signal<Page<Categoria> | null>(null);
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

  eliminar(c: Categoria): void {
    if (!confirm(`¿Eliminar la categoría "${c.nombre}"? Esta acción no se puede deshacer.`)) return;
    this.categoriaService.eliminar(c.id).subscribe({
      next: () => this.cargar(),
      error: (e) => this.error.set(e.message ?? 'Error al eliminar la categoría.')
    });
  }

  private cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.categoriaService.listar(this.paginaActual(), 20).subscribe({
      next: (data) => {
        this.page.set(data);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(e.message ?? 'Error al cargar categorías.');
        this.cargando.set(false);
      }
    });
  }
}
