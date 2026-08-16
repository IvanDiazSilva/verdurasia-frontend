import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, NEVER } from 'rxjs';
import { PedidoFormComponent } from './pedido-form.component';
import { ClienteService } from '../../../core/services/cliente.service';
import { ProductoService } from '../../../core/services/producto.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Page } from '../../../core/models/page.model';
import { Cliente } from '../../../core/models/cliente.model';
import { Producto } from '../../../core/models/producto.model';

// ── Stubs ─────────────────────────────────────────────────────────────────────

const PRODUCTOS_STUB: Producto[] = [
  { id: 1, nombre: 'Tomate',  precio: 2.00, stock: 10, unidad: 'kg', activo: true },
  { id: 2, nombre: 'Lechuga', precio: 1.50, stock: 5,  unidad: 'ud', activo: true },
];

const CLIENTES_PAGE_STUB: Page<Cliente> = {
  content:       [],
  totalElements: 0,
  totalPages:    0,
  size:          200,
  number:        0,
  first:         true,
  last:          true,
};

const PRODUCTOS_PAGE_STUB: Page<Producto> = {
  content:       PRODUCTOS_STUB,
  totalElements: 2,
  totalPages:    1,
  size:          200,
  number:        0,
  first:         true,
  last:          true,
};

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('PedidoFormComponent — totalEstimado', () => {
  let fixture:   ComponentFixture<PedidoFormComponent>;
  let component: PedidoFormComponent;

  beforeEach(async () => {
    const clienteServiceStub  = { listar: () => of(CLIENTES_PAGE_STUB) };
    const productoServiceStub = { listar: () => of(PRODUCTOS_PAGE_STUB) };
    const pedidoServiceStub   = { crear:  () => NEVER };
    const routerStub          = { navigate: vi.fn() };
    const activatedRouteStub  = { snapshot: {}, params: of({}), queryParams: of({}) };

    await TestBed.configureTestingModule({
      imports: [PedidoFormComponent],
      providers: [
        { provide: ClienteService,   useValue: clienteServiceStub  },
        { provide: ProductoService,  useValue: productoServiceStub },
        { provide: PedidoService,    useValue: pedidoServiceStub   },
        { provide: Router,           useValue: routerStub          },
        { provide: ActivatedRoute,   useValue: activatedRouteStub  },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(PedidoFormComponent);
    component = fixture.componentInstance;

    // Triggers ngOnInit: loads products into preciosMap and adds the first line.
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  // ── T1 ─────────────────────────────────────────────────────────────────────

  it('T1: calculates total for one line with a known product and quantity > 1', () => {
    // ngOnInit adds one empty line; configure it with product 1 and quantity 3.
    component.lineas.at(0).patchValue({ productoId: 1, cantidad: 3 });
    component.onProductoSeleccionado(0); // forces computed reeval

    expect(component.totalEstimado()).toBe(6);
  });

  // ── T2 ─────────────────────────────────────────────────────────────────────

  it('T2: sums totals across multiple lines correctly', () => {
    // Line 0: product 1, qty 2 → 4.00
    component.lineas.at(0).patchValue({ productoId: 1, cantidad: 2 });
    component.onProductoSeleccionado(0);

    // Line 1: product 2, qty 1 → 1.50
    component.agregarLinea();
    component.lineas.at(1).patchValue({ productoId: 2, cantidad: 1 });
    component.onProductoSeleccionado(1);

    expect(component.totalEstimado()).toBe(5.5);
  });

  // ── T3 ─────────────────────────────────────────────────────────────────────

  it('T3: recalculates total when quantity changes', () => {
    component.lineas.at(0).patchValue({ productoId: 1, cantidad: 1 });
    component.onProductoSeleccionado(0);
    expect(component.totalEstimado()).toBe(2);

    // valueChanges subscription increments _totalVersion automatically.
    component.lineas.at(0).get('cantidad')!.setValue(4);

    expect(component.totalEstimado()).toBe(8);
  });

  // ── T4 ─────────────────────────────────────────────────────────────────────

  it('T4: recalculates total when a line is removed', () => {
    // Line 0: product 1, qty 2 → 4.00
    component.lineas.at(0).patchValue({ productoId: 1, cantidad: 2 });
    component.onProductoSeleccionado(0);

    // Line 1: product 2, qty 1 → 1.50; total = 5.50
    component.agregarLinea();
    component.lineas.at(1).patchValue({ productoId: 2, cantidad: 1 });
    component.onProductoSeleccionado(1);
    expect(component.totalEstimado()).toBe(5.5);

    // Remove line 1; total should drop to 4.00
    component.eliminarLinea(1);

    expect(component.totalEstimado()).toBe(4);
  });

  // ── T5 ─────────────────────────────────────────────────────────────────────

  it('T5: does not add amount for a line without a product', () => {
    // productoId remains null (default from agregarLinea); just set cantidad.
    component.lineas.at(0).patchValue({ productoId: null, cantidad: 3 });
    // Force reeval without selecting a product through the normal flow.
    component.onProductoSeleccionado(0);

    expect(component.totalEstimado()).toBe(0);
  });

  // ── T6 ─────────────────────────────────────────────────────────────────────

  it('T6: does not add amount when productoId is not in the price map', () => {
    component.lineas.at(0).patchValue({ productoId: 999, cantidad: 5 });
    // onProductoSeleccionado is the public API that triggers the recompute
    // after a product is selected — it covers the "product not found" path too.
    component.onProductoSeleccionado(0);

    expect(component.totalEstimado()).toBe(0);
  });
});
