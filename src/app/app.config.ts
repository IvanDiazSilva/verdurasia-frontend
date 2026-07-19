import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';

/**
 * Factory para APP_INITIALIZER.
 * Keycloak se inicializa antes de que Angular arranque cualquier componente.
 * Si el usuario no está autenticado, Keycloak lo redirige a la página de login.
 */
function initKeycloak(auth: AuthService): () => Promise<void> {
  return () => auth.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor,      // 1. Adjunta Bearer token
        httpErrorInterceptor  // 2. Maneja errores HTTP (incluido 401/403)
      ])
    ),
    {
      provide:    APP_INITIALIZER,
      useFactory: initKeycloak,
      deps:       [AuthService],
      multi:      true
    }
  ]
};
