import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../../core/services/producto.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-header">
      <h2 class="page-title">Nuevo producto</h2>
      <a routerLink="/productos" class="btn btn--ghost btn--sm">← Volver</a>
    </div>

    @if (errorGlobal()) {
      <div class="alert alert--error" role="alert">
        <strong>Error:</strong> {{ errorGlobal() }}
      </div>
    }

    <div class="card">
      <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>

        <!-- Nombre -->
        <div class="field">
          <label class="label" for="nombre">Nombre <span class="required">*</span></label>
          <input
            id="nombre"
            class="input"
            [class.input--error]="touched('nombre')"
            type="text"
            formControlName="nombre"
            placeholder="Ej: Tomates cherry"
          />
          @if (touched('nombre')) {
            @if (ctrl('nombre').hasError('required')) {
              <span class="field-error">El nombre es obligatorio.</span>
            } @else if (ctrl('nombre').hasError('minlength')) {
              <span class="field-error">El nombre debe tener al menos 2 caracteres.</span>
            } @else if (ctrl('nombre').hasError('maxlength')) {
              <span class="field-error">El nombre no puede superar los 150 caracteres.</span>
            }
          }
        </div>

        <!-- Descripción -->
        <div class="field">
          <label class="label" for="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            class="input input--textarea"
            formControlName="descripcion"
            rows="3"
            placeholder="Descripción opcional del producto"
          ></textarea>
        </div>

        <!-- Precio + Unidad -->
        <div class="field-row">
          <div class="field">
            <label class="label" for="precio">Precio (€) <span class="required">*</span></label>
            <input
              id="precio"
              class="input"
              [class.input--error]="touched('precio')"
              type="number"
              formControlName="precio"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            @if (touched('precio')) {
              @if (ctrl('precio').hasError('required')) {
                <span class="field-error">El precio es obligatorio.</span>
              } @else if (ctrl('precio').hasError('min')) {
                <span class="field-error">El precio no puede ser negativo.</span>
              }
            }
          </div>

          <div class="field">
            <label class="label" for="unidad">Unidad <span class="required">*</span></label>
            <select id="unidad" class="input" formControlName="unidad">
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="ud">ud</option>
              <option value="caja">caja</option>
              <option value="l">l</option>
              <option value="ml">ml</option>
            </select>
          </div>
        </div>

        <!-- Stock -->
        <div class="field">
          <label class="label" for="stock">Stock inicial <span class="required">*</span></label>
          <input
            id="stock"
            class="input"
            [class.input--error]="touched('stock')"
            type="number"
            formControlName="stock"
            min="0"
            step="1"
            placeholder="0"
          />
          @if (touched('stock')) {
            @if (ctrl('stock').hasError('required')) {
              <span class="field-error">El stock es obligatorio.</span>
            } @else if (ctrl('stock').hasError('min')) {
              <span class="field-error">El stock no puede ser negativo.</span>
            }
          }
        </div>

        <!-- Categoría -->
        <div class="field">
          <label class="label" for="categoriaId">Categoría</label>
          @if (cargandoCategorias()) {
            <div class="state-msg">Cargando categorías...</div>
          } @else {
            <select id="categoriaId" class="input" formControlName="categoriaId">
              <option [ngValue]="null">— Sin categoría —</option>
              @for (cat of categorias(); track cat.id) {
                <option [ngValue]="cat.id">{{ cat.nombre }}</option>
              }
            </select>
          }
          @if (errorCategorias()) {
            <span class="field-error">{{ errorCategorias() }}</span>
          }
        </div>

        <!-- Acciones -->
        <div class="form-actions">
          <button type="submit" class="btn btn--primary" [disabled]="guardando() || (form.invalid && form.touched)">
            {{ guardando() ? 'Guardando...' : 'Guardar producto' }}
          </button>
          <a routerLink="/productos" class="btn btn--ghost">Cancelar</a>
        </div>

      </form>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }
    .page-title { font-size: 1.25rem; font-weight: 600; color: #1a1a1a; margin: 0; }

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
      max-width: 640px;
    }

    .field { margin-bottom: 1.1rem; }
    .field-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.1rem;
    }

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
    }
    .input:focus { border-color: #2d6a4f; box-shadow: 0 0 0 2px rgba(45,106,79,0.12); }
    .input--error { border-color: #ef4444; }
    .input--textarea { resize: vertical; min-height: 80px; }

    .field-error {
      display: block;
      margin-top: 0.3rem;
      font-size: 0.78rem;
      color: #ef4444;
    }

    .state-msg { font-size: 0.875rem; color: #6b7280; padding: 0.5rem 0; }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.5rem 1.1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.15s, opacity 0.15s;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn--primary  { background: #2d6a4f; color: #fff; }
    .btn--primary:hover:not(:disabled) { background: #1b4332; }
    .btn--ghost { background: transparent; border: 1px solid #d1d5db; color: #374151; }
    .btn--ghost:hover { background: #f3f4f6; }
    .btn--sm { padding: 0.3rem 0.65rem; font-size: 0.8rem; }
  `]
})
export class ProductoFormComponent implements OnInit {
  private readonly fb              = inject(FormBuilder);
  private readonly productoService = inject(ProductoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly router          = inject(Router);

  form = this.fb.group({
    nombre:      ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    descripcion: [''],
    precio:      [null as number | null, [Validators.required, Validators.min(0)]],
    stock:       [0,   [Validators.required, Validators.min(0)]],
    unidad:      ['kg', Validators.required],
    categoriaId: [null as number | null]
  });

  categorias        = signal<Categoria[]>([]);
  cargandoCategorias = signal(false);
  errorCategorias   = signal<string | null>(null);
  guardando         = signal(false);
  errorGlobal       = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarCategorias();
  }

  /** Devuelve el AbstractControl de un campo del formulario. */
  ctrl(field: string): AbstractControl {
    return this.form.get(field)!;
  }

  /** True si el campo ha sido tocado y tiene errores de validación. */
  touched(field: string): boolean {
    const c = this.ctrl(field);
    return !!(c?.invalid && c?.touched);
  }

  guardar(): void {
    // Marcar todos los campos como tocados para activar los mensajes de error inline
    this.form.markAllAsTouched();

    // Guardia de validación en el método: nunca llama a la API si el form es inválido
    if (this.form.invalid) {
      this.errorGlobal.set(null); // limpiar cualquier error previo del backend
      return;
    }

    this.guardando.set(true);
    this.errorGlobal.set(null);

    const val = this.form.getRawValue();
    this.productoService.crear({
      nombre:      val.nombre!,
      descripcion: val.descripcion || undefined,
      precio:      val.precio!,
      stock:       val.stock!,
      unidad:      val.unidad!,
      categoriaId: val.categoriaId ?? null
    }).subscribe({
      next: () => this.router.navigate(['/productos']),
      error: (e: { message?: string }) => {
        this.errorGlobal.set(e.message ?? 'Error inesperado al guardar el producto. Inténtalo de nuevo.');
        this.guardando.set(false);
      }
    });
  }

  private cargarCategorias(): void {
    this.cargandoCategorias.set(true);
    this.categoriaService.listar().subscribe({
      next: (page) => {
        this.categorias.set(page.content);
        this.cargandoCategorias.set(false);
      },
      error: (e) => {
        this.errorCategorias.set(e.message ?? 'No se pudieron cargar las categorías');
        this.cargandoCategorias.set(false);
      }
    });
  }
}
