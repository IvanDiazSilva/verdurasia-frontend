import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OfertaService } from './oferta.service';
import { environment } from '../../../environments/environment';
import { Oferta, OfertaCreateRequest, OfertaUpdateRequest } from '../models/oferta.model';
import { Page } from '../models/page.model';

const BASE = `${environment.apiUrl}/ofertas`;

const OFERTA_STUB: Oferta = {
  id: 1,
  nombre: 'Promo Verano',
  descuento: 10,
  tipo: 'PORCENTAJE',
  fechaInicio: '2026-08-01',
  fechaFin: '2026-08-31',
  activa: true,
  productoId: 2,
  productoNombre: 'Tomate',
};

const PAGE_STUB: Page<Oferta> = {
  content: [OFERTA_STUB],
  totalElements: 1,
  totalPages: 1,
  size: 20,
  number: 0,
  first: true,
  last: true,
};

describe('OfertaService', () => {
  let service: OfertaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OfertaService],
    });
    service = TestBed.inject(OfertaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ── listar ───────────────────────────────────────────────────────────────────

  it('listar() debe hacer GET con params de paginación', () => {
    service.listar(0, 20).subscribe(page => {
      expect(page.content.length).toBe(1);
      expect(page.content[0].nombre).toBe('Promo Verano');
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

  // ── vigentes ──────────────────────────────────────────────────────────────────

  it('vigentes() debe hacer GET a /ofertas/vigentes sin params', () => {
    service.vigentes().subscribe(ofertas => {
      expect(ofertas.length).toBe(1);
      expect(ofertas[0].activa).toBeTruthy();
    });

    const req = httpMock.expectOne(`${BASE}/vigentes`);
    expect(req.request.method).toBe('GET');
    req.flush([OFERTA_STUB]);
  });

  // ── obtener ──────────────────────────────────────────────────────────────────

  it('obtener() debe hacer GET al endpoint correcto con el id', () => {
    service.obtener(1).subscribe(o => {
      expect(o.id).toBe(1);
      expect(o.nombre).toBe('Promo Verano');
    });

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(OFERTA_STUB);
  });

  // ── crear ────────────────────────────────────────────────────────────────────

  it('crear() debe hacer POST con el body correcto', () => {
    const payload: OfertaCreateRequest = {
      nombre: 'Oferta Otoño',
      descuento: 15,
      tipo: 'MONTO_FIJO',
      fechaInicio: '2026-09-01',
      fechaFin: '2026-09-30',
    };

    service.crear(payload).subscribe(o => {
      expect(o.id).toBe(1);
    });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(OFERTA_STUB);
  });

  // ── actualizar ───────────────────────────────────────────────────────────────

  it('actualizar() debe hacer PATCH al endpoint correcto con el body correcto', () => {
    const payload: OfertaUpdateRequest = { descuento: 20, activa: false };

    service.actualizar(1, payload).subscribe(o => {
      expect(o.id).toBe(1);
    });

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(OFERTA_STUB);
  });

  // ── eliminar ─────────────────────────────────────────────────────────────────

  it('eliminar() debe hacer DELETE al endpoint correcto con el id', () => {
    service.eliminar(1).subscribe();

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
