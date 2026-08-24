import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Pedido, EstadoPedido, ESTADO_LABEL } from '../../core/models/pedido.model';
import { Oferta } from '../../core/models/oferta.model';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideNoopAnimations()]
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