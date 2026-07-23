import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PedidoService } from '../../../core/services/pedido.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { ProductoService } from '../../../core/services/producto.service';
import { Cliente } from '../../../core/models/cliente.model';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-header">
      <h2 class="page-title">Nuevo pedido</h2>
      <a routerLink="/pedidos" class="btn btn--ghost btn--sm">← Volver</a>
    </div>

    @if (errorGlobal()) {
      <div class="alert alert--error" role="alert">
        <strong>Error:</strong> {{ errorGlobal() }}
      </div>
    }

    <div class="card">
      <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>

        <!-- Cliente -->
        <div class="field">
          <label class="label" for="clienteId">Cliente <span class="required">*</span></label>
          @if (cargandoClientes()) {
            <div class="state-msg-inline">Cargando clientes...</div>
          } @else if (errorClientes()) {
            <div class="state-msg-inline state-msg-inline--error">{{ errorClientes() }}</div>
          } @else {
            <select
              id="clienteId"
              class="input"
              [class.input--error]="touched('clienteId')"
              formControlName="clienteId"
            >
              <option [ngValue]="null">— Selecciona un cliente —</option>
              @for (c of clientes(); track c.id) {
                <option [ngValue]="c.id">{{ c.nombre }} ({{ c.email }})</option>
              }
            </select>
          }
          @if (touched('clienteId')) {
            <span class="field-error">Debes seleccionar un cliente.</span>
          }
        </div>

        <!-- Notas -->
        <div class="field">
          <label class="label" for="notas">Notas</label>
          <textarea
            id="notas"
            class="input input--textarea"
            formControlName="notas"
            rows="2"
            placeholder="Instrucciones de entrega, observaciones..."
          ></textarea>
        </div>

        <!-- Líneas del pedido -->
        <div class="section-header">
          <h3 class="section-title">Líneas del pedido</h3>
          <button type="button" class="btn btn--ghost btn--sm" (click)="agregarLinea()">+ Añadir línea</button>
        </div>

        @if (lineas.length === 0) {
          <div class="empty-lines">Añade al menos un producto al pedido.</div>
        }

        <div formArrayName="items">
          @for (linea of lineas.controls; track $index) {
            <div class="linea" [formGroupName]="$index">
              <!-- Selector de producto -->
              <div class="field field--producto">
                <label class="label" [for]="'prod-' + $index">Producto <span class="required">*</span></label>
                @if (cargandoProductos()) {
                  <div class="state-msg-inline">Cargando...</div>
                } @else {
                  <select
                    [id]="'prod-' + $index"
                    class="input"
                    [class.input--error]="lineaTouched($index, 'productoId')"
                    formControlName="productoId"
                    (change)="onProductoSeleccionado($index)"
                  >
                    <option [ngValue]="null">— Selecciona producto —</option>
                    @for (p of productos(); track p.id) {
                      <option [ngValue]="p.id">{{ p.nombre }} ({{ p.precio | number:'1.2-2' }} €/{{ p.unidad }})</option>
                    }
                  </select>
                }
                @if (lineaTouched($index, 'productoId')) {
                  <span class="field-error">Selecciona un producto.</span>
                }
              </div>

              <!-- Cantidad -->
              <div class="field field--cantidad">
                <label class="label" [for]="'cant-' + $index">Cantidad <span class="required">*</span></label>
                <input
                  [id]="'cant-' + $index"
                  class="input"
                  [class.input--error]="lineaTouched($index, 'cantidad')"
                  type="number"
                  min="1"
                  step="1"
                  formControlName="cantidad"
                  placeholder="1"
                />
                @if (lineaTouched($index, 'cantidad')) {
                  @if (lineaCtrl($index, 'cantidad').hasError('required')) {
                    <span class="field-error">La cantidad es obligatoria.</span>
                  } @else if (lineaCtrl($index, 'cantidad').hasError('min')) {
                    <span class="field-error">La cantidad mínima es 1.</span>
                  }
                }
              </div>

              <!-- Precio unitario (informativo) -->
              <div class="field field--precio">
                <label class="label">Precio unit.</label>
                <div class="precio-display">{{ precioLinea($index) | number:'1.2-2' }} €</div>
              </div>

              <!-- Subtotal (informativo) -->
              <div class="field field--subtotal">
                <label class="label">Subtotal</label>
                <div class="precio-display precio-display--subtotal">{{ subtotalLinea($index) | number:'1.2-2' }} €</div>
              </div>

              <!-- Eliminar línea -->
              <button
                type="button"
                class="btn btn--ghost btn--sm btn--danger linea-remove"
                (click)="eliminarLinea($index)"
                title="Eliminar línea"
              >✕</button>
            </div>
          }
        </div>

        <!-- Total calculado -->
        @if (lineas.length > 0) {
          <div class="total-row">
            <span class="total-label">Total estimado</span>
            <span class="total-valor">{{ totalEstimado() | number:'1.2-2' }} €</span>
          </div>
        }

        @if (form.touched && lineas.length === 0) {
          <div class="field-error" style="margin-top:0.5rem">Debes añadir al menos una línea al pedido.</div>
        }

        <!-- Acciones -->
        <div class="form-actions">
          <button
            type="submit"
            class="btn btn--primary"
            [disabled]="guardando() || (form.invalid && form.touched)"
          >
            {{ guardando() ? 'Creando pedido...' : 'Crear pedido' }}
          </button>
          <a routerLink="/pedidos" class="btn btn--ghost">Cancelar</a>
        </div>

      </form>
    </div>
  `,
  styles: [`


    .alert {
      padding: 0.75rem 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }
    .alert--error {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fca5a5;
      border-left: 4px solid #ef4444;
    }
    .alert--error strong { font-weight: 600; }

    .card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;
      max-width: 800px;
    }

    .field { margin-bottom: 1.1rem; }
    .label {
      display: block;
      margin-bottom: 0.35rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }
    .required { color: #c0392b; margin-left: 2px; }

    .input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.875rem;
      font-family: inherit;
      color: #111827;
      background: #fff;
      outline: none;
      transition: border-color 0.15s;
      box-sizing: border-box;
    }
    .input:focus { border-color: #2d6a4f; box-shadow: 0 0 0 2px rgba(45,106,79,0.12); }
    .input--error { border-color: #ef4444; }
    .input--textarea { resize: vertical; min-height: 64px; }

    .field-error {
      display: block;
      margin-top: 0.3rem;
      font-size: 0.78rem;
      color: #ef4444;
    }

    .state-msg-inline { font-size: 0.875rem; color: #6b7280; padding: 0.4rem 0; }
    .state-msg-inline--error { color: #c0392b; }

    /* Líneas */
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    .section-title { font-size: 1rem; font-weight: 600; color: #374151; margin: 0; }

    .empty-lines {
      padding: 1.25rem;
      text-align: center;
      color: #9ca3af;
      font-size: 0.875rem;
      border: 1px dashed #d1d5db;
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    .linea {
      display: grid;
      grid-template-columns: 2fr 0.7fr 0.7fr 0.7fr auto;
      gap: 0.75rem;
      align-items: end;
      padding: 0.75rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      margin-bottom: 0.5rem;
    }
    .linea .field { margin-bottom: 0; }

    .precio-display {
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      color: #374151;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      text-align: right;
      min-height: 36px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .precio-display--subtotal { font-weight: 600; color: #2d6a4f; }

    .linea-remove {
      margin-bottom: 0;
      align-self: end;
    }

    .total-row {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 1rem;
      margin-top: 0.75rem;
      padding: 0.75rem 1rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 6px;
    }
    .total-label { font-size: 0.875rem; font-weight: 600; color: #374151; }
    .total-valor { font-size: 1.1rem; font-weight: 700; color: #2d6a4f; }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }


  `]
})
export class PedidoFormComponent implements OnInit {
  private readonly fb             = inject(FormBuilder);
  private readonly pedidoService  = inject(PedidoService);
  private readonly clienteService = inject(ClienteService);
  private readonly productoService = inject(ProductoService);
  private readonly router         = inject(Router);

  clientes         = signal<Cliente[]>([]);
  cargandoClientes = signal(false);
  errorClientes    = signal<string | null>(null);

  productos         = signal<Producto[]>([]);
  cargandoProductos = signal(false);
  errorProductos    = signal<string | null>(null);

  guardando   = signal(false);
  errorGlobal = signal<string | null>(null);

  /** Mapa productoId → precio unitario para calcular totales en tiempo real. */
  private preciosMap = new Map<number, number>();

  form = this.fb.group({
    clienteId: [null as number | null, Validators.required],
    notas:     [''],
    items:     this.fb.array([], Validators.minLength(1))
  });

  get lineas(): FormArray {
    return this.form.get('items') as FormArray;
  }

  /** Total estimado calculado en el cliente con los precios cargados. */
  totalEstimado = computed(() => {
    // Se recalcula al leer señales; aquí lo computamos directamente sobre el FormArray.
    // Usamos un truco: accedemos a un signal de versión para que computed reaccione
    // cuando el usuario cambia inputs (no es reactivo por defecto con FormArray).
    return this._totalVersion(); // dummy read para forzar recompute
  });

  /** Signal auxiliar que incrementamos manualmente para forzar recompute de totalEstimado. */
  private _totalVersion = signal(0);

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarProductos();
    // Añadir una línea vacía por defecto para facilitar el inicio
    this.agregarLinea();
  }

  agregarLinea(): void {
    const grupo = this.fb.group({
      productoId: [null as number | null, Validators.required],
      cantidad:   [1, [Validators.required, Validators.min(1)]]
    });
    // Recalcular total cuando cambia cantidad
    grupo.get('cantidad')!.valueChanges.subscribe(() => this._totalVersion.update(v => v + 1));
    this.lineas.push(grupo);
  }

  eliminarLinea(index: number): void {
    this.lineas.removeAt(index);
    this._totalVersion.update(v => v + 1);
  }

  onProductoSeleccionado(index: number): void {
    this._totalVersion.update(v => v + 1);
  }

  precioLinea(index: number): number {
    const productoId = this.lineas.at(index).get('productoId')?.value;
    return productoId ? (this.preciosMap.get(productoId) ?? 0) : 0;
  }

  subtotalLinea(index: number): number {
    const cantidad = this.lineas.at(index).get('cantidad')?.value ?? 0;
    return this.precioLinea(index) * cantidad;
  }

  /** Calcula el total sumando los subtotales de todas las líneas. */
  private calcularTotal(): number {
    let total = 0;
    for (let i = 0; i < this.lineas.length; i++) {
      total += this.subtotalLinea(i);
    }
    return total;
  }

  ctrl(field: string): AbstractControl {
    return this.form.get(field)!;
  }

  touched(field: string): boolean {
    const c = this.ctrl(field);
    return !!(c?.invalid && c?.touched);
  }

  lineaCtrl(index: number, field: string): AbstractControl {
    return (this.lineas.at(index) as FormGroup).get(field)!;
  }

  lineaTouched(index: number, field: string): boolean {
    const c = this.lineaCtrl(index, field);
    return !!(c?.invalid && c?.touched);
  }

  guardar(): void {
    this.form.markAllAsTouched();

    if (this.lineas.length === 0) {
      this.errorGlobal.set('Debes añadir al menos una línea al pedido.');
      return;
    }

    if (this.form.invalid) {
      this.errorGlobal.set(null);
      return;
    }

    this.guardando.set(true);
    this.errorGlobal.set(null);

    const val = this.form.getRawValue();
    this.pedidoService.crear({
      clienteId: val.clienteId!,
      notas:     val.notas || undefined,
      items:     (val.items as { productoId: number; cantidad: number }[]).map(i => ({
        productoId: i.productoId,
        cantidad:   i.cantidad
      }))
    }).subscribe({
      next: () => this.router.navigate(['/pedidos']),
      error: (e: { message?: string }) => {
        this.errorGlobal.set(e.message ?? 'Error inesperado al crear el pedido.');
        this.guardando.set(false);
      }
    });
  }

  private cargarClientes(): void {
    this.cargandoClientes.set(true);
    // Cargamos hasta 200 clientes activos para el selector.
    // Si el negocio crece, habría que añadir búsqueda con typeahead.
    this.clienteService.listar(0, 200).subscribe({
      next: (page) => {
        this.clientes.set(page.content.filter(c => c.activo));
        this.cargandoClientes.set(false);
      },
      error: (e) => {
        this.errorClientes.set(e.message ?? 'No se pudieron cargar los clientes.');
        this.cargandoClientes.set(false);
      }
    });
  }

  private cargarProductos(): void {
    this.cargandoProductos.set(true);
    // Cargamos hasta 200 productos activos para los selectores de línea.
    this.productoService.listar(0, 200).subscribe({
      next: (page) => {
        const activos = page.content.filter(p => p.activo);
        this.productos.set(activos);
        // Construir mapa de precios para cálculo de totales
        this.preciosMap.clear();
        activos.forEach(p => this.preciosMap.set(p.id, p.precio));
        this.cargandoProductos.set(false);
        this._totalVersion.update(v => v + 1);
      },
      error: (e) => {
        this.errorProductos.set(e.message ?? 'No se pudieron cargar los productos.');
        this.cargandoProductos.set(false);
      }
    });
  }
}
