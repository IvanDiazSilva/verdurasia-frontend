import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guardia funcional de autenticación.
 *
 * Dado que Keycloak se inicializa con `onLoad: 'login-required'` en el APP_INITIALIZER,
 * Angular no llega a renderizar ninguna ruta si el usuario no está autenticado.
 * Este guard actúa como capa de seguridad adicional y punto de extensión
 * (por ejemplo, para guards de roles en el futuro).
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  if (auth.isAuthenticated()) {
    return true;
  }

  // Fallback: si por alguna razón el usuario no está autenticado, forzar login
  auth.login();
  return false;
};

/**
 * Guardia de rol ADMIN. Deniega acceso si el usuario no tiene el rol ADMIN.
 * Redirige al dashboard con un indicador de acceso denegado.
 */
export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }

  // Redirigir al dashboard — el operador no tiene acceso a acciones de escritura
  return router.createUrlTree(['/dashboard']);
};
