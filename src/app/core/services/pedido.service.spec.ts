import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PedidoService } from './pedido.service';
import { environment } from '../../../environments/environment';
import { Pedido, PedidoCreateRequest, PedidoCambiarEstadoRequest } from '../models/pedido.model';
import { Page } from '../models/page.model';

const BASE = `${environment.apiUrl}/pedidos`;

/** Stub mínimo de Pedido para respuestas simuladas */
const PEDIDO_STUB: Pedido = {
  id: 1,
  clienteId: 10,
  clienteNombre: 'Ana García',
  estado: 'PENDIENTE',
  total: 25.5,
  items: [],
};

const PAGE_STUB: Page<Pedido> = {
  content: [PEDIDO_STUB],
  totalElements: 1,
  totalPages: 1,
  size: 20,
  number: 0,
  first: true,
  last: true,
};

describe('PedidoService', () => {
  let service: PedidoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PedidoService],
    });
    service = TestBed.inject(PedidoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no queden requests HTTP sin resolver
    httpMock.verify();
  });

  // ── listar ──────────────────────────────────────────────────────────────────

  it('listar() debe hacer GET al endpoint de pedidos con params de paginación', () => {
    // Arrange + Act
    service.listar(0, 20).subscribe(page => {
      // Assert — respuesta mapeada correctamente
      expect(page.content.length).toBe(1);
      expect(page.content[0].id).toBe(1);
    });

    // Assert — petición HTTP
    const req = httpMock.expectOne(`${BASE}?page=0&size=20`);
    expect(req.request.method).toBe('GET');
    req.flush(PAGE_STUB);
  });

  it('listar() debe usar page=0 y size=20 como valores por defecto', () => {
    service.listar().subscribe();

    const req = httpMock.expectOne(`${BASE}?page=0&size=20`);
    expect(req.request.method).toBe('GET');
    req.flush(PAGE_STUB);
  });

  // ── obtener ──────────────────────────────────────────────────────────────────

  it('obtener() debe hacer GET al endpoint correcto con el id', () => {
    service.obtener(1).subscribe(pedido => {
      expect(pedido.id).toBe(1);
    });

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(PEDIDO_STUB);
  });

  // ── crear ────────────────────────────────────────────────────────────────────

  it('crear() debe hacer POST al endpoint de pedidos con el body correcto', () => {
    const payload: PedidoCreateRequest = {
      clienteId: 10,
      notas: 'Sin cebolla',
      items: [{ productoId: 3, cantidad: 2 }],
    };

    service.crear(payload).subscribe(pedido => {
      expect(pedido.id).toBe(1);
    });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(PEDIDO_STUB);
  });

  // ── cambiarEstado ─────────────────────────────────────────────────────────────

  it('cambiarEstado() debe hacer PATCH a /pedidos/:id/estado con el body correcto', () => {
    const payload: PedidoCambiarEstadoRequest = { estado: 'CONFIRMADO' };

    service.cambiarEstado(1, payload).subscribe(pedido => {
      expect(pedido.estado).toBe('PENDIENTE'); // lo que devuelve el stub
    });

    const req = httpMock.expectOne(`${BASE}/1/estado`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(PEDIDO_STUB);
  });

  // ── eliminar ──────────────────────────────────────────────────────────────────

  it('eliminar() debe hacer DELETE al endpoint correcto con el id', () => {
    service.eliminar(1).subscribe();

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
