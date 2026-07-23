import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OfertaService } from '../../../core/services/oferta.service';
import { ProductoService } from '../../../core/services/producto.service';
import { Producto } from '../../../core/models/producto.model';
import { TipoOferta } from '../../../core/models/oferta.model';

@Component({
  selector: 'app-oferta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-header">
      <h2 class="page-title">{{ esEdicion() ? 'Editar oferta' : 'Nueva oferta' }}</h2>
      <a routerLink="/ofertas" class="btn btn--ghost btn--sm">← Volver</a>
    </div>

    @if (cargandoOferta()) {
      <div class="state-msg">Cargando oferta...</div>
    } @else if (errorCarga()) {
      <div class="state-msg state-msg--error">{{ errorCarga() }}</div>
    } @else {
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
              placeholder="Ej: Descuento verano tomates"
            />
            @if (touched('nombre')) {
              @if (ctrl('nombre').hasError('required')) {
                <span class="field-error">El nombre es obligatorio.</span>
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
              rows="2"
              placeholder="Descripción opcional de la oferta"
            ></textarea>
          </div>

          <!-- Tipo + Descuento -->
          <div class="field-row">
            <div class="field">
              <label class="label" for="tipo">Tipo de descuento <span class="required">*</span></label>
              <select id="tipo" class="input" formControlName="tipo">
                <option value="PORCENTAJE">% Porcentaje</option>
                <option value="MONTO_FIJO">€ Monto fijo</option>
              </select>
            </div>

            <div class="field">
              <label class="label" for="descuento">
                Descuento <span class="required">*</span>
                <span class="label-hint">
                  {{ form.get('tipo')?.value === 'PORCENTAJE' ? '(0.01 – 100 %)' : '(0.01 – 100 €)' }}
                </span>
              </label>
              <input
                id="descuento"
                class="input"
                [class.input--error]="touched('descuento')"
                type="number"
                formControlName="descuento"
                min="0.01"
                max="100"
                step="0.01"
                placeholder="Ej: 15"
              />
              @if (touched('descuento')) {
                @if (ctrl('descuento').hasError('required')) {
                  <span class="field-error">El descuento es obligatorio.</span>
                } @else if (ctrl('descuento').hasError('min') || ctrl('descuento').hasError('max')) {
                  <span class="field-error">El descuento debe estar entre 0.01 y 100.</span>
                }
              }
            </div>
          </div>

          <!-- Fechas -->
          <div class="field-row">
            <div class="field">
              <label class="label" for="fechaInicio">Fecha inicio <span class="required">*</span></label>
              <input
                id="fechaInicio"
                class="input"
                [class.input--error]="touched('fechaInicio')"
                type="date"
                formControlName="fechaInicio"
              />
              @if (touched('fechaInicio') && ctrl('fechaInicio').hasError('required')) {
                <span class="field-error">La fecha de inicio es obligatoria.</span>
              }
            </div>

            <div class="field">
              <label class="label" for="fechaFin">Fecha fin <span class="required">*</span></label>
              <input
                id="fechaFin"
                class="input"
                [class.input--error]="touched('fechaFin')"
                type="date"
                formControlName="fechaFin"
              />
              @if (touched('fechaFin')) {
                @if (ctrl('fechaFin').hasError('required')) {
                  <span class="field-error">La fecha de fin es obligatoria.</span>
                } @else if (form.hasError('fechaInvalida')) {
                  <span class="field-error">La fecha de fin debe ser posterior a la de inicio.</span>
                }
              }
            </div>
          </div>

          <!-- Producto (opcional) -->
          <div class="field">
            <label class="label" for="productoId">
              Producto asociado
              <span class="label-hint">(opcional — dejar vacío para oferta global)</span>
            </label>
            @if (cargandoProductos()) {
              <div class="state-msg-inline">Cargando productos...</div>
            } @else {
              <select id="productoId" class="input" formControlName="productoId">
                <option [ngValue]="null">— Sin producto (oferta global) —</option>
                @for (p of productos(); track p.id) {
                  <option [ngValue]="p.id">{{ p.nombre }}</option>
                }
              </select>
            }
          </div>

          <!-- Activa (solo en edición) -->
          @if (esEdicion()) {
            <div class="field">
              <label class="label" for="activa">Estado</label>
              <select id="activa" class="input" formControlName="activa">
                <option [ngValue]="true">Activa</option>
                <option [ngValue]="false">Inactiva</option>
              </select>
            </div>
          }

          <!-- Acciones -->
          <div class="form-actions">
            <button
              type="submit"
              class="btn btn--primary"
              [disabled]="guardando() || (form.invalid && form.touched)"
            >
              {{ guardando() ? 'Guardando...' : (esEdicion() ? 'Guardar cambios' : 'Crear oferta') }}
            </button>
            <a routerLink="/ofertas" class="btn btn--ghost">Cancelar</a>
          </div>

        </form>
      </div>
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
    .state-msg-inline { font-size: 0.875rem; color: #6b7280; padding: 0.4rem 0; }

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
      max-width: 680px;
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
    .label-hint { font-size: 0.78rem; font-weight: 400; color: #9ca3af; margin-left: 4px; }

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

    .form-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }


  `]
})
export class OfertaFormComponent implements OnInit {
  private readonly fb             = inject(FormBuilder);
  private readonly ofertaService  = inject(OfertaService);
  private readonly productoService = inject(ProductoService);
  private readonly router         = inject(Router);
  private readonly route          = inject(ActivatedRoute);

  esEdicion       = signal(false);
  ofertaId        = signal<number | null>(null);
  cargandoOferta  = signal(false);
  errorCarga      = signal<string | null>(null);

  productos         = signal<Producto[]>([]);
  cargandoProductos = signal(false);

  guardando   = signal(false);
  errorGlobal = signal<string | null>(null);

  form = this.fb.group(
    {
      nombre:      ['', [Validators.required, Validators.maxLength(150)]],
      descripcion: [''],
      tipo:        ['PORCENTAJE' as TipoOferta, Validators.required],
      descuento:   [null as number | null, [Validators.required, Validators.min(0.01), Validators.max(100)]],
      fechaInicio: ['', Validators.required],
      fechaFin:    ['', Validators.required],
      productoId:  [null as number | null],
      activa:      [true]
    },
    { validators: fechaFinValidator }
  );

  ngOnInit(): void {
    this.cargarProductos();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.esEdicion.set(true);
      this.ofertaId.set(id);
      this.cargarOferta(id);
    }
  }

  ctrl(field: string): AbstractControl {
    return this.form.get(field)!;
  }

  touched(field: string): boolean {
    const c = this.ctrl(field);
    return !!(c?.invalid && c?.touched);
  }

  guardar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.errorGlobal.set(null);
      return;
    }

    this.guardando.set(true);
    this.errorGlobal.set(null);

    const val = this.form.getRawValue();

    if (this.esEdicion() && this.ofertaId() !== null) {
      this.ofertaService.actualizar(this.ofertaId()!, {
        nombre:      val.nombre      || undefined,
        descripcion: val.descripcion || undefined,
        tipo:        val.tipo        as TipoOferta,
        descuento:   val.descuento   ?? undefined,
        fechaInicio: val.fechaInicio || undefined,
        fechaFin:    val.fechaFin    || undefined,
        activa:      val.activa      ?? undefined,
        productoId:  val.productoId  ?? null
      }).subscribe({
        next: () => this.router.navigate(['/ofertas']),
        error: (e: { message?: string }) => {
          this.errorGlobal.set(e.message ?? 'Error inesperado al actualizar la oferta.');
          this.guardando.set(false);
        }
      });
    } else {
      this.ofertaService.crear({
        nombre:      val.nombre!,
        descripcion: val.descripcion || undefined,
        tipo:        val.tipo        as TipoOferta,
        descuento:   val.descuento!,
        fechaInicio: val.fechaInicio!,
        fechaFin:    val.fechaFin!,
        productoId:  val.productoId  ?? null
      }).subscribe({
        next: () => this.router.navigate(['/ofertas']),
        error: (e: { message?: string }) => {
          this.errorGlobal.set(e.message ?? 'Error inesperado al crear la oferta.');
          this.guardando.set(false);
        }
      });
    }
  }

  private cargarOferta(id: number): void {
    this.cargandoOferta.set(true);
    this.errorCarga.set(null);
    this.ofertaService.obtener(id).subscribe({
      next: (o) => {
        this.form.patchValue({
          nombre:      o.nombre,
          descripcion: o.descripcion ?? '',
          tipo:        o.tipo,
          descuento:   o.descuento,
          fechaInicio: o.fechaInicio,  // ya viene como 'YYYY-MM-DD' desde el backend
          fechaFin:    o.fechaFin,
          activa:      o.activa,
          productoId:  o.productoId ?? null
        });
        this.cargandoOferta.set(false);
      },
      error: (e: { message?: string }) => {
        this.errorCarga.set(e.message ?? 'No se pudo cargar la oferta.');
        this.cargandoOferta.set(false);
      }
    });
  }

  private cargarProductos(): void {
    this.cargandoProductos.set(true);
    this.productoService.listar(0, 200).subscribe({
      next: (page) => {
        this.productos.set(page.content.filter(p => p.activo));
        this.cargandoProductos.set(false);
      },
      error: () => {
        // No es crítico: el selector simplemente mostrará solo la opción global
        this.cargandoProductos.set(false);
      }
    });
  }
}

/** Validador a nivel de FormGroup: fechaFin debe ser >= fechaInicio. */
function fechaFinValidator(group: AbstractControl) {
  const inicio = group.get('fechaInicio')?.value as string;
  const fin    = group.get('fechaFin')?.value    as string;
  if (!inicio || !fin) return null;
  return fin >= inicio ? null : { fechaInvalida: true };
}
