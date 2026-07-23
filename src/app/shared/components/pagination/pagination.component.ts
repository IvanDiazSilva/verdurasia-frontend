import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from '../../../core/models/page.model';

/**
 * Componente de paginación reutilizable.
 *
 * Uso:
 *   <app-pagination [page]="page()" [itemLabel]="'clientes'" (pageChange)="cambiarPagina($event)" />
 *
 * - `page`       : objeto Page<T> tal como lo devuelve la API (Spring Boot).
 * - `itemLabel`  : nombre del recurso en plural para el contador, p.ej. "clientes". Opcional.
 * - `pageChange` : emite el índice de página (0-based) que se ha solicitado.
 *
 * El componente solo se renderiza cuando hay más de una página.
 */
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (page && page.totalPages > 1) {
      <div class="pagination">
        <button
          class="btn btn--ghost btn--sm"
          [disabled]="page.first"
          (click)="onPageChange(page.number - 1)"
        >
          ← Anterior
        </button>

        <span class="pagination__info">
          Página {{ page.number + 1 }} de {{ page.totalPages }}
          @if (itemLabel) {
            ({{ page.totalElements }} {{ itemLabel }})
          }
        </span>

        <button
          class="btn btn--ghost btn--sm"
          [disabled]="page.last"
          (click)="onPageChange(page.number + 1)"
        >
          Siguiente →
        </button>
      </div>
    }
  `,
  styles: [`
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
    }
    .pagination__info { font-size: 0.875rem; color: #6b7280; }

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
    .btn--ghost { background: transparent; border: 1px solid #d1d5db; color: #374151; }
    .btn--ghost:hover { background: #f3f4f6; }
    .btn--sm { padding: 0.3rem 0.65rem; font-size: 0.8rem; }
  `]
})
export class PaginationComponent {
  @Input({ required: true }) page!: Page<unknown>;
  @Input() itemLabel?: string;
  @Output() pageChange = new EventEmitter<number>();

  onPageChange(index: number): void {
    this.pageChange.emit(index);
  }
}
