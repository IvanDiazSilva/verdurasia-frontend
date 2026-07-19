import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Oferta, OfertaCreateRequest, OfertaUpdateRequest } from '../models/oferta.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class OfertaService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/ofertas`;

  listar(page = 0, size = 20): Observable<Page<Oferta>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Oferta>>(this.base, { params });
  }

  /** Ofertas activas y dentro de rango de fechas hoy. Sin paginación. */
  vigentes(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.base}/vigentes`);
  }

  obtener(id: number): Observable<Oferta> {
    return this.http.get<Oferta>(`${this.base}/${id}`);
  }

  crear(data: OfertaCreateRequest): Observable<Oferta> {
    return this.http.post<Oferta>(this.base, data);
  }

  actualizar(id: number, data: OfertaUpdateRequest): Observable<Oferta> {
    return this.http.patch<Oferta>(`${this.base}/${id}`, data);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
