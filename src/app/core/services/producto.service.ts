import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Producto, ProductoCreateRequest } from '../models/producto.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/productos`;

  listar(page = 0, size = 20, nombre?: string, categoriaId?: number): Observable<Page<Producto>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (nombre)      params = params.set('nombre', nombre);
    if (categoriaId) params = params.set('categoriaId', categoriaId);
    return this.http.get<Page<Producto>>(this.base, { params });
  }

  obtener(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.base}/${id}`);
  }

  crear(data: ProductoCreateRequest): Observable<Producto> {
    return this.http.post<Producto>(this.base, data);
  }

  actualizar(id: number, data: Partial<ProductoCreateRequest>): Observable<Producto> {
    return this.http.patch<Producto>(`${this.base}/${id}`, data);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
