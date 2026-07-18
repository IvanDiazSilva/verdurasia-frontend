import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar">
      <span class="topbar__section-title">{{ title }}</span>
      <div class="topbar__actions">
        <span class="topbar__user">Admin</span>
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
    .topbar__user {
      font-size: 0.875rem;
      color: #666;
    }
  `]
})
export class TopbarComponent {
  title = 'VerdurasIA';
}
