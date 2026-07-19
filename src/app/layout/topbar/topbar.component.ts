import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <span class="topbar__section-title">{{ title }}</span>
      <div class="topbar__actions">
        <span class="topbar__user">{{ auth.fullName() || auth.username() }}</span>
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
  `]
})
export class TopbarComponent {
  readonly auth = inject(AuthService);
  readonly title = 'VerdurasIA';
}
