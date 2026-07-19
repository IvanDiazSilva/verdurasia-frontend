import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.status === 0) {
        errorMessage = 'No se puede conectar con el servidor';
      } else if (error.status === 401) {
        // Token expirado o inválido — forzar re-login
        auth.login();
        errorMessage = 'Sesión expirada. Redirigiendo al login...';
      } else if (error.status === 403) {
        errorMessage = 'No tienes permiso para realizar esta acción';
      } else if (error.status === 404) {
        errorMessage = error.error?.message ?? 'Recurso no encontrado';
      } else if (error.status === 400) {
        errorMessage = error.error?.message ?? 'Petición incorrecta';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      }

      console.error(`[HTTP Error] ${error.status}: ${errorMessage}`, error);
      return throwError(() => ({ status: error.status, message: errorMessage, original: error }));
    })
  );
};
