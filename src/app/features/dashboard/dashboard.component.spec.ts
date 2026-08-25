import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Pedido, EstadoPedido, ESTADO_LABEL } from '../../core/models/pedido.model';
import { Oferta } from '../../core/models/oferta.model';
import { Producto } from '../../core/models/producto.model';
import { Cliente } from '../../core/models/cliente.model';
import { ProductoService } from '../../core/services/producto.service';
import { ClienteService } from '../../core/services/cliente.service';
import { PedidoService } from '../../core/services/pedido.service';
import { OfertaService } from '../../core/services/oferta.service';
import { of } from 'rxjs';

class MockProductoService {
  listar(page = 0, size = 20, nombre?: string, categoriaId?: number) {
    return of({
      content: [
        { id: 1, nombre: 'Producto 1', precio: 100, categoriaId: 1 }
      ] as Producto[],
      totalElements: 1,
      totalPages: 1,
      size: size,
      number: page,
      first: page === 0,
      last: true
    } as any);
  }
}

class MockClienteService {
  listar(page = 0, size = 20, nombre?: string) {
    return of({
      content: [
        { id: 1, nombre: 'Cliente 1', email: 'test@test.com' } as Cliente
      ],
      totalElements: 1,
      totalPages: 1,
      size: size,
      number: page,
      first: page === 0,
      last: true
    } as any);
  }
}

class MockPedidoService {
  listar(page = 0, size = 20, estado?: EstadoPedido) {
    const items = [
      { id: 1, clienteNombre: 'Cliente Test', estado: 'PENDIENTE', total: 50, createdAt: new Date() },
      { id: 2, clienteNombre: 'Cliente Test 2', estado: 'CONFIRMADO', total: 75, createdAt: new Date() }
    ];
    return of({
      content: items,
      totalElements: items.length,
      totalPages: 1,
      size: size,
      number: page,
      first: page === 0,
      last: true
    } as any);
  }
}

class MockOfertaService {
  vigentes() {
    return of([
      { id: 1, nombre: 'Oferta 1', descuento: 10, tipo: 'PORCENTAJE', fechaFin: new Date() },
      { id: 2, nombre: 'Oferta 2', descuento: 20, tipo: 'PORCENTAJE', fechaFin: new Date() }
    ] as any);
  }
  listar(page = 0, size = 20) {
    return of({
      content: [
        { id: 1, nombre: 'Oferta 1', descuento: 10, tipo: 'PORCENTAJE' } as Oferta
      ],
      totalElements: 1,
      totalPages: 1,
      size: size,
      number: page,
      first: page === 0,
      last: true
    } as any);
  }
}

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideNoopAnimations(),
        { provide: ProductoService, useClass: MockProductoService },
        { provide: ClienteService, useClass: MockClienteService },
        { provide: PedidoService, useClass: MockPedidoService },
        { provide: OfertaService, useClass: MockOfertaService },
        { provide: ActivatedRoute, useValue: { snapshot: {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have hoy date set', () => {
    expect(component.hoy).toBeTruthy();
  });

  it('should have the correct number of tarjeta properties', () => {
    const tarjetas = component.tarjetas();
    expect(tarjetas).toBeDefined();
    // Each tarjeta must have: titulo, valor, enlace, icono, color
    tarjetas.forEach(t => {
      expect(t).toHaveProperty('titulo');
      expect(t).toHaveProperty('valor');
      expect(t).toHaveProperty('enlace');
      expect(t).toHaveProperty('icono');
      expect(t).toHaveProperty('color');
    });
  });

  it('should render without errors', () => {
    expect(fixture.nativeElement.querySelector('.dash-header')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.page-title')).toBeTruthy();
  });

  it('should have initial signals accessible', () => {
    expect(component.tarjetas).toBeDefined();
    expect(component.ultimosPedidos).toBeDefined();
    expect(component.ofertasVigentes).toBeDefined();
    expect(component.pedidosPendientes).toBeDefined();
    expect(component.cargando).toBeDefined();
    expect(component.error).toBeDefined();
  });

  it('should have correct tarjeta count structure', () => {
    const tarjetas = component.tarjetas();
    // Should have at least the original 5 + new metrics
    expect(tarjetas.length).toBeGreaterThanOrEqual(5);
  });
});