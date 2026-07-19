import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente, ClienteCreateRequest, ClienteUpdateRequest } from '../models/cliente.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/clientes`;

  listar(page = 0, size = 20): Observable<Page<Cliente>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Cliente>>(this.base, { params });
  }

  obtener(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.base}/${id}`);
  }

  crear(data: ClienteCreateRequest): Observable<Cliente> {
    return this.http.post<Cliente>(this.base, data);
  }

  actualizar(id: number, data: ClienteUpdateRequest): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.base}/${id}`, data);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
