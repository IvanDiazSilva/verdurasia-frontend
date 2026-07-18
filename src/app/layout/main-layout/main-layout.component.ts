import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="layout">
      <app-sidebar />
      <div class="layout__content">
        <app-topbar />
        <main class="layout__main">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
    }
    .layout__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #f5f5f5;
    }
    .layout__main {
      flex: 1;
      padding: 1.5rem;
    }
  `]
})
export class MainLayoutComponent {}
