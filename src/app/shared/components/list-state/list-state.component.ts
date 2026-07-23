import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente de estado reutilizable para listados.
 *
 * Uso:
 *   <app-list-state
 *     [cargando]="cargando()"
 *     [error]="error()"
 *     [vacio]="items().length === 0"
 *     mensajeVacio="No hay registros."
 *   />
 *
 * - Muestra el bloque de carga, error o vacío según corresponda.
 * - Si ninguno aplica, no renderiza nada (el padre muestra su contenido).
 * - `mensajeVacio` es opcional; por defecto: 'No hay registros.'
 */
@Component({
  selector: 'app-list-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (cargando) {
      <div class="state-msg">Cargando...</div>
    } @else if (error) {
      <div class="state-msg state-msg--error">{{ error }}</div>
    } @else if (vacio) {
      <div class="state-msg">{{ mensajeVacio }}</div>
    }
  `,
  styles: [`
    .state-msg {
      padding: 2rem;
      text-align: center;
      color: #666;
      font-size: 0.9rem;
    }
    .state-msg--error { color: #c0392b; }
  `]
})
export class ListStateComponent {
  @Input({ required: true }) cargando!: boolean;
  @Input({ required: true }) error!: string | null;
  @Input({ required: true }) vacio!: boolean;
  @Input() mensajeVacio: string = 'No hay registros.';
}
