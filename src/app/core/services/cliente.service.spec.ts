import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClienteService } from './cliente.service';
import { environment } from '../../../environments/environment';
import { Cliente, ClienteCreateRequest, ClienteUpdateRequest } from '../models/cliente.model';
import { Page } from '../models/page.model';

const BASE = `${environment.apiUrl}/clientes`;

/** Stub mínimo de Cliente para respuestas simuladas */
const CLIENTE_STUB: Cliente = {
  id: 1,
  nombre: 'María López',
  email: 'maria@example.com',
  activo: true,
};

const PAGE_STUB: Page<Cliente> = {
  content: [CLIENTE_STUB],
  totalElements: 1,
  totalPages: 1,
  size: 20,
  number: 0,
  first: true,
  last: true,
};

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClienteService],
    });
    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ── listar ───────────────────────────────────────────────────────────────────

  it('listar() sin nombre debe hacer GET sin param ?nombre', () => {
    service.listar(0, 20).subscribe(page => {
      expect(page.content.length).toBe(1);
    });

    const req = httpMock.expectOne(`${BASE}?page=0&size=20`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('nombre')).toBeFalsy();
    req.flush(PAGE_STUB);
  });

  it('listar() con nombre debe añadir ?nombre al request', () => {
    service.listar(0, 20, 'María').subscribe();

    const req = httpMock.expectOne(`${BASE}?page=0&size=20&nombre=Mar%C3%ADa`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('nombre')).toBe('María');
    req.flush(PAGE_STUB);
  });

  it('listar() con nombre en blanco no debe añadir ?nombre', () => {
    service.listar(0, 20, '   ').subscribe();

    const req = httpMock.expectOne(`${BASE}?page=0&size=20`);
    expect(req.request.params.has('nombre')).toBeFalsy();
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
    service.obtener(1).subscribe(cliente => {
      expect(cliente.id).toBe(1);
      expect(cliente.nombre).toBe('María López');
    });

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(CLIENTE_STUB);
  });

  // ── crear ────────────────────────────────────────────────────────────────────

  it('crear() debe hacer POST con el body correcto', () => {
    const payload: ClienteCreateRequest = {
      nombre: 'Pedro Ruiz',
      email: 'pedro@example.com',
    };

    service.crear(payload).subscribe(cliente => {
      expect(cliente.id).toBe(1);
    });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(CLIENTE_STUB);
  });

  // ── actualizar ───────────────────────────────────────────────────────────────

  it('actualizar() debe hacer PATCH al endpoint correcto con el body correcto', () => {
    const payload: ClienteUpdateRequest = { nombre: 'María Actualizada' };

    service.actualizar(1, payload).subscribe(cliente => {
      expect(cliente.id).toBe(1);
    });

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(CLIENTE_STUB);
  });

  // ── eliminar ──────────────────────────────────────────────────────────────────

  it('eliminar() debe hacer DELETE al endpoint correcto con el id', () => {
    service.eliminar(1).subscribe();

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
