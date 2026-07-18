import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar">
      <div class="sidebar__brand">
        <span class="sidebar__logo">🌿</span>
        <span class="sidebar__title">VerdurasIA</span>
      </div>
      <ul class="sidebar__menu">
        @for (item of navItems; track item.route) {
          <li>
            <a
              [routerLink]="item.route"
              routerLinkActive="sidebar__link--active"
              class="sidebar__link"
            >
              <span class="sidebar__icon">{{ item.icon }}</span>
              <span class="sidebar__label">{{ item.label }}</span>
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 220px;
      min-height: 100vh;
      background: #2d6a4f;
      color: #fff;
      display: flex;
      flex-direction: column;
      padding: 1rem 0;
    }
    .sidebar__brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0 1.25rem 1.5rem;
      font-size: 1.2rem;
      font-weight: 700;
      border-bottom: 1px solid rgba(255,255,255,0.15);
    }
    .sidebar__menu {
      list-style: none;
      margin: 1rem 0 0;
      padding: 0;
    }
    .sidebar__link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      transition: background 0.2s;
    }
    .sidebar__link:hover,
    .sidebar__link--active {
      background: rgba(255,255,255,0.15);
      color: #fff;
    }
    .sidebar__icon { font-size: 1.1rem; }
  `]
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard',  route: '/dashboard', icon: '📊' },
    { label: 'Clientes',   route: '/clientes',  icon: '👥' },
    { label: 'Productos',  route: '/productos',  icon: '🥦' },
    { label: 'Pedidos',    route: '/pedidos',    icon: '📦' },
    { label: 'Ofertas',    route: '/ofertas',    icon: '🏷️' }
  ];
}
