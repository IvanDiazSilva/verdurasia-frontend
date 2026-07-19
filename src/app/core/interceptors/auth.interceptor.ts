import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

/**
 * Interceptor HTTP que adjunta el Bearer token a todas las peticiones
 * dirigidas al backend de VerdurasIA.
 *
 * Solo inyecta la cabecera en peticiones al apiUrl configurado en environment,
 * para no enviar el token a servicios de terceros.
 *
 * Obtiene un token válido (renovándolo si es necesario) de forma asíncrona
 * antes de clonar la petición.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo interceptar peticiones al backend propio
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const auth = inject(AuthService);

  return from(auth.getValidToken()).pipe(
    switchMap(token => {
      if (!token) return next(req);

      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next(authReq);
    })
  );
};
