import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.status === 0) {
        errorMessage = 'No se puede conectar con el servidor';
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
