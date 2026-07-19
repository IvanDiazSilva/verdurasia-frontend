import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../../core/services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-header">
      <h2 class="page-title">{{ esEdicion() ? 'Editar cliente' : 'Nuevo cliente' }}</h2>
      <a routerLink="/clientes" class="btn btn--ghost btn--sm">← Volver</a>
    </div>

    @if (cargandoCliente()) {
      <div class="state-msg">Cargando datos del cliente...</div>
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
              placeholder="Ej: María García"
            />
            @if (touched('nombre')) {
              @if (ctrl('nombre').hasError('required')) {
                <span class="field-error">El nombre es obligatorio.</span>
              } @else if (ctrl('nombre').hasError('maxlength')) {
                <span class="field-error">El nombre no puede superar los 150 caracteres.</span>
              }
            }
          </div>

          <!-- Email -->
          <div class="field">
            <label class="label" for="email">Email <span class="required">*</span></label>
            <input
              id="email"
              class="input"
              [class.input--error]="touched('email')"
              type="email"
              formControlName="email"
              placeholder="Ej: maria@ejemplo.com"
            />
            @if (touched('email')) {
              @if (ctrl('email').hasError('required')) {
                <span class="field-error">El email es obligatorio.</span>
              } @else if (ctrl('email').hasError('email')) {
                <span class="field-error">Introduce un email válido.</span>
              } @else if (ctrl('email').hasError('maxlength')) {
                <span class="field-error">El email no puede superar los 255 caracteres.</span>
              }
            }
          </div>

          <!-- Teléfono + Activo (solo en edición) -->
          <div class="field-row">
            <div class="field">
              <label class="label" for="telefono">Teléfono</label>
              <input
                id="telefono"
                class="input"
                [class.input--error]="touched('telefono')"
                type="tel"
                formControlName="telefono"
                placeholder="Ej: 612 345 678"
              />
              @if (touched('telefono') && ctrl('telefono').hasError('maxlength')) {
                <span class="field-error">El teléfono no puede superar los 30 caracteres.</span>
              }
            </div>

            @if (esEdicion()) {
              <div class="field">
                <label class="label" for="activo">Estado</label>
                <select id="activo" class="input" formControlName="activo">
                  <option [ngValue]="true">Activo</option>
                  <option [ngValue]="false">Inactivo</option>
                </select>
              </div>
            }
          </div>

          <!-- Dirección -->
          <div class="field">
            <label class="label" for="direccion">Dirección</label>
            <textarea
              id="direccion"
              class="input input--textarea"
              formControlName="direccion"
              rows="2"
              placeholder="Dirección de entrega (opcional)"
            ></textarea>
          </div>

          <!-- Acciones -->
          <div class="form-actions">
            <button
              type="submit"
              class="btn btn--primary"
              [disabled]="guardando() || (form.invalid && form.touched)"
            >
              {{ guardando() ? 'Guardando...' : (esEdicion() ? 'Guardar cambios' : 'Crear cliente') }}
            </button>
            <a routerLink="/clientes" class="btn btn--ghost">Cancelar</a>
          </div>

        </form>
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
      box-sizing: border-box;
    }
    .input:focus { border-color: #2d6a4f; box-shadow: 0 0 0 2px rgba(45,106,79,0.12); }
    .input--error { border-color: #ef4444; }
    .input--textarea { resize: vertical; min-height: 70px; }

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
export class ClienteFormComponent implements OnInit {
  private readonly fb             = inject(FormBuilder);
  private readonly clienteService = inject(ClienteService);
  private readonly router         = inject(Router);
  private readonly route          = inject(ActivatedRoute);

  esEdicion       = signal(false);
  clienteId       = signal<number | null>(null);
  cargandoCliente = signal(false);
  errorCarga      = signal<string | null>(null);
  guardando       = signal(false);
  errorGlobal     = signal<string | null>(null);

  form = this.fb.group({
    nombre:    ['', [Validators.required, Validators.maxLength(150)]],
    email:     ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    telefono:  ['', [Validators.maxLength(30)]],
    direccion: [''],
    activo:    [true]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.esEdicion.set(true);
      this.clienteId.set(id);
      this.cargarCliente(id);
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

    if (this.esEdicion() && this.clienteId() !== null) {
      this.clienteService.actualizar(this.clienteId()!, {
        nombre:    val.nombre    || undefined,
        email:     val.email     || undefined,
        telefono:  val.telefono  || undefined,
        direccion: val.direccion || undefined,
        activo:    val.activo    ?? undefined
      }).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: (e: { message?: string }) => {
          this.errorGlobal.set(e.message ?? 'Error inesperado al actualizar el cliente.');
          this.guardando.set(false);
        }
      });
    } else {
      this.clienteService.crear({
        nombre:    val.nombre!,
        email:     val.email!,
        telefono:  val.telefono  || undefined,
        direccion: val.direccion || undefined
      }).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: (e: { message?: string }) => {
          this.errorGlobal.set(e.message ?? 'Error inesperado al crear el cliente.');
          this.guardando.set(false);
        }
      });
    }
  }

  private cargarCliente(id: number): void {
    this.cargandoCliente.set(true);
    this.errorCarga.set(null);
    this.clienteService.obtener(id).subscribe({
      next: (cliente) => {
        this.form.patchValue({
          nombre:    cliente.nombre,
          email:     cliente.email,
          telefono:  cliente.telefono  ?? '',
          direccion: cliente.direccion ?? '',
          activo:    cliente.activo
        });
        this.cargandoCliente.set(false);
      },
      error: (e: { message?: string }) => {
        this.errorCarga.set(e.message ?? 'No se pudo cargar el cliente.');
        this.cargandoCliente.set(false);
      }
    });
  }
}
