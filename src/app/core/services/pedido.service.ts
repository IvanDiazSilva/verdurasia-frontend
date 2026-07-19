import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Pedido,
  PedidoCreateRequest,
  PedidoCambiarEstadoRequest,
} from '../models/pedido.model';
import { Page } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/pedidos`;

  listar(page = 0, size = 20): Observable<Page<Pedido>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Pedido>>(this.base, { params });
  }

  obtener(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.base}/${id}`);
  }

  crear(data: PedidoCreateRequest): Observable<Pedido> {
    return this.http.post<Pedido>(this.base, data);
  }

  cambiarEstado(id: number, data: PedidoCambiarEstadoRequest): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.base}/${id}/estado`, data);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
