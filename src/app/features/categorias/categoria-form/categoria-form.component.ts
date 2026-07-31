import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaService } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-header">
      <h2 class="page-title">{{ esEdicion() ? 'Editar categoría' : 'Nueva categoría' }}</h2>
      <a routerLink="/categorias" class="btn btn--ghost btn--sm">← Volver</a>
    </div>

    @if (cargandoCategoria()) {
      <div class="state-msg">Cargando datos de la categoría...</div>
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
              placeholder="Ej: Verduras de hoja"
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
              rows="3"
              placeholder="Descripción opcional de la categoría"
            ></textarea>
          </div>

          <!-- Acciones -->
          <div class="form-actions">
            <button
              type="submit"
              class="btn btn--primary"
              [disabled]="guardando() || (form.invalid && form.touched)"
            >
              {{ guardando() ? 'Guardando...' : (esEdicion() ? 'Guardar cambios' : 'Crear categoría') }}
            </button>
            <a routerLink="/categorias" class="btn btn--ghost">Cancelar</a>
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

    .card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;
      max-width: 560px;
    }

    .input--textarea { resize: vertical; min-height: 80px; }
  `]
})
export class CategoriaFormComponent implements OnInit {
  private readonly fb               = inject(FormBuilder);
  private readonly categoriaService = inject(CategoriaService);
  private readonly router           = inject(Router);
  private readonly route            = inject(ActivatedRoute);

  esEdicion        = signal(false);
  categoriaId      = signal<number | null>(null);
  cargandoCategoria = signal(false);
  errorCarga       = signal<string | null>(null);
  guardando        = signal(false);
  errorGlobal      = signal<string | null>(null);

  form = this.fb.group({
    nombre:      ['', [Validators.required, Validators.maxLength(150)]],
    descripcion: ['']
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.esEdicion.set(true);
      this.categoriaId.set(id);
      this.cargarCategoria(id);
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

    if (this.esEdicion() && this.categoriaId() !== null) {
      this.categoriaService.actualizar(this.categoriaId()!, {
        nombre:      val.nombre      || undefined,
        descripcion: val.descripcion || undefined
      }).subscribe({
        next: () => this.router.navigate(['/categorias']),
        error: (e: { message?: string }) => {
          this.errorGlobal.set(e.message ?? 'Error inesperado al actualizar la categoría.');
          this.guardando.set(false);
        }
      });
    } else {
      this.categoriaService.crear({
        nombre:      val.nombre!,
        descripcion: val.descripcion || undefined
      }).subscribe({
        next: () => this.router.navigate(['/categorias']),
        error: (e: { message?: string }) => {
          this.errorGlobal.set(e.message ?? 'Error inesperado al crear la categoría.');
          this.guardando.set(false);
        }
      });
    }
  }

  private cargarCategoria(id: number): void {
    this.cargandoCategoria.set(true);
    this.errorCarga.set(null);
    this.categoriaService.obtener(id).subscribe({
      next: (categoria) => {
        this.form.patchValue({
          nombre:      categoria.nombre,
          descripcion: categoria.descripcion ?? ''
        });
        this.cargandoCategoria.set(false);
      },
      error: (e: { message?: string }) => {
        this.errorCarga.set(e.message ?? 'No se pudo cargar la categoría.');
        this.cargandoCategoria.set(false);
      }
    });
  }
}
