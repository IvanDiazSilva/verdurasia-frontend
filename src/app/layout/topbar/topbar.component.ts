import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <span class="topbar__section-title">{{ title }}</span>
      <div class="topbar__actions">
        <span class="topbar__user">{{ auth.fullName() || auth.username() }}</span>
        <span class="topbar__relogio">{{ relogio }}</span>
        @if (auth.isAdmin()) {
          <span class="topbar__role topbar__role--admin">ADMIN</span>
        } @else {
          <span class="topbar__role topbar__role--operador">OPERADOR</span>
        }
        <button class="topbar__logout" (click)="auth.logout()" title="Cerrar sesión">
          Salir
        </button>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      height: 56px;
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
    }
    .topbar__section-title {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
    }
    .topbar__actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .topbar__user {
      font-size: 0.875rem;
      color: #374151;
      font-weight: 500;
    }
    .topbar__role {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      letter-spacing: 0.04em;
    }
    .topbar__role--admin    { background: #dbeafe; color: #1e40af; }
    .topbar__role--operador { background: #d1fae5; color: #065f46; }
    .topbar__logout {
      font-size: 0.8rem;
      font-weight: 500;
      color: #6b7280;
      background: transparent;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 0.25rem 0.65rem;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .topbar__logout:hover {
      background: #fee2e2;
      color: #991b1b;
      border-color: #fca5a5;
    }
    .topbar__relogio {
      font-size: 0.85rem;
      color: #6b7280;
      margin-left: 0.5rem;
    }
  `]
})
export class TopbarComponent implements OnInit, OnDestroy {
  readonly auth = inject(AuthService);
  readonly title = 'VerdurasIA';

  private relogioAtual = signal<Date>(new Date());
  private intervalId: number | null = null;
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.intervalId = window.setInterval(() => {
      this.relogioAtual.set(new Date());
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  get relogio(): string {
    const agora = this.relogioAtual();
    const data = agora.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const hora = agora.toLocaleTimeString('es-PE', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return `${data} · ${hora}`;
  }
}
