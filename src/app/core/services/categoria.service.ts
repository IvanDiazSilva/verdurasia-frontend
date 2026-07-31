import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categoria, CategoriaCreateRequest, CategoriaUpdateRequest } from '../models/categoria.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/categorias`;

  listar(page = 0, size = 100): Observable<Page<Categoria>> {
    return this.http.get<Page<Categoria>>(this.base, {
      params: { page, size }
    });
  }

  obtener(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.base}/${id}`);
  }

  crear(data: CategoriaCreateRequest): Observable<Categoria> {
    return this.http.post<Categoria>(this.base, data);
  }

  actualizar(id: number, data: CategoriaUpdateRequest): Observable<Categoria> {
    return this.http.patch<Categoria>(`${this.base}/${id}`, data);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
