import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductoService } from './producto.service';
import { environment } from '../../../environments/environment';
import { Producto, ProductoCreateRequest } from '../models/producto.model';
import { Page } from '../models/page.model';

const BASE = `${environment.apiUrl}/productos`;

const PRODUCTO_STUB: Producto = {
  id: 1,
  nombre: 'Tomate',
  precio: 2.5,
  stock: 100,
  unidad: 'kg',
  activo: true,
  categoriaId: 3,
  categoriaNombre: 'Verduras',
};

const PAGE_STUB: Page<Producto> = {
  content: [PRODUCTO_STUB],
  totalElements: 1,
  totalPages: 1,
  size: 20,
  number: 0,
  first: true,
  last: true,
};

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoService],
    });
    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ── listar ───────────────────────────────────────────────────────────────────

  it('listar() debe hacer GET con params de paginación', () => {
    service.listar(0, 20).subscribe(page => {
      expect(page.content.length).toBe(1);
      expect(page.content[0].nombre).toBe('Tomate');
    });

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

  it('listar() con nombre debe añadir ?nombre al request', () => {
    service.listar(0, 20, 'Tomate').subscribe();

    const req = httpMock.expectOne(`${BASE}?page=0&size=20&nombre=Tomate`);
    expect(req.request.method).toBe('GET');
    req.flush(PAGE_STUB);
  });

  it('listar() con categoriaId debe añadir ?categoriaId al request', () => {
    service.listar(0, 20, undefined, 3).subscribe();

    const req = httpMock.expectOne(`${BASE}?page=0&size=20&categoriaId=3`);
    expect(req.request.method).toBe('GET');
    req.flush(PAGE_STUB);
  });

  it('listar() con nombre y categoriaId debe añadir ambos params', () => {
    service.listar(0, 20, 'Tomate', 3).subscribe();

    const req = httpMock.expectOne(`${BASE}?page=0&size=20&nombre=Tomate&categoriaId=3`);
    expect(req.request.method).toBe('GET');
    req.flush(PAGE_STUB);
  });

  // ── obtener ──────────────────────────────────────────────────────────────────

  it('obtener() debe hacer GET al endpoint correcto con el id', () => {
    service.obtener(1).subscribe(p => {
      expect(p.id).toBe(1);
      expect(p.nombre).toBe('Tomate');
    });

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(PRODUCTO_STUB);
  });

  // ── crear ────────────────────────────────────────────────────────────────────

  it('crear() debe hacer POST con el body correcto', () => {
    const payload: ProductoCreateRequest = {
      nombre: 'Pepino',
      precio: 1.2,
      stock: 50,
      unidad: 'kg',
    };

    service.crear(payload).subscribe(p => {
      expect(p.id).toBe(1);
    });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(PRODUCTO_STUB);
  });

  // ── actualizar ───────────────────────────────────────────────────────────────

  it('actualizar() debe hacer PATCH al endpoint correcto con el body correcto', () => {
    const payload: Partial<ProductoCreateRequest> = { precio: 3.0 };

    service.actualizar(1, payload).subscribe(p => {
      expect(p.id).toBe(1);
    });

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(PRODUCTO_STUB);
  });

  // ── eliminar ─────────────────────────────────────────────────────────────────

  it('eliminar() debe hacer DELETE al endpoint correcto con el id', () => {
    service.eliminar(1).subscribe();

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
