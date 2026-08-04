import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoriaService } from './categoria.service';
import { environment } from '../../../environments/environment';
import { Categoria, CategoriaCreateRequest, CategoriaUpdateRequest } from '../models/categoria.model';
import { Page } from '../models/page.model';

const BASE = `${environment.apiUrl}/categorias`;

/** Stub mínimo de Categoria para respuestas simuladas */
const CATEGORIA_STUB: Categoria = {
  id: 1,
  nombre: 'Verduras',
  descripcion: 'Verduras frescas de temporada',
};

const PAGE_STUB: Page<Categoria> = {
  content: [CATEGORIA_STUB],
  totalElements: 1,
  totalPages: 1,
  size: 100,
  number: 0,
  first: true,
  last: true,
};

describe('CategoriaService', () => {
  let service: CategoriaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoriaService],
    });
    service = TestBed.inject(CategoriaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ── listar ───────────────────────────────────────────────────────────────────

  it('listar() debe hacer GET al endpoint de categorías con params de paginación', () => {
    service.listar(0, 100).subscribe(page => {
      expect(page.content.length).toBe(1);
      expect(page.content[0].nombre).toBe('Verduras');
    });

    const req = httpMock.expectOne(`${BASE}?page=0&size=100`);
    expect(req.request.method).toBe('GET');
    req.flush(PAGE_STUB);
  });

  it('listar() debe usar page=0 y size=100 como valores por defecto', () => {
    service.listar().subscribe();

    const req = httpMock.expectOne(`${BASE}?page=0&size=100`);
    expect(req.request.method).toBe('GET');
    req.flush(PAGE_STUB);
  });

  // ── obtener ──────────────────────────────────────────────────────────────────

  it('obtener() debe hacer GET al endpoint correcto con el id', () => {
    service.obtener(1).subscribe(categoria => {
      expect(categoria.id).toBe(1);
      expect(categoria.nombre).toBe('Verduras');
    });

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(CATEGORIA_STUB);
  });

  // ── crear ────────────────────────────────────────────────────────────────────

  it('crear() debe hacer POST con el body correcto', () => {
    const payload: CategoriaCreateRequest = {
      nombre: 'Frutas',
      descripcion: 'Frutas de temporada',
    };

    service.crear(payload).subscribe(categoria => {
      expect(categoria.id).toBe(1);
    });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(CATEGORIA_STUB);
  });

  // ── actualizar ───────────────────────────────────────────────────────────────

  it('actualizar() debe hacer PUT (no PATCH) al endpoint correcto con el body correcto', () => {
    const payload: CategoriaUpdateRequest = { nombre: 'Verduras de hoja' };

    service.actualizar(1, payload).subscribe(categoria => {
      expect(categoria.id).toBe(1);
    });

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(CATEGORIA_STUB);
  });

  // ── eliminar ──────────────────────────────────────────────────────────────────

  it('eliminar() debe hacer DELETE al endpoint correcto con el id', () => {
    service.eliminar(1).subscribe();

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
