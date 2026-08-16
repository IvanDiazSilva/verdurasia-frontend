import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of, NEVER, Subscription } from 'rxjs';
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

// ── T7 ─────────────────────────────────────────────────────────────────────

  it('T7: control of removed line does not affect total after elimination', () => {
    // Two lines: product 1 qty 1 → 2.00, product 2 qty 1 → 1.50; total = 3.50
    component.lineas.at(0).patchValue({ productoId: 1, cantidad: 1 });
    component.onProductoSeleccionado(0);
    component.agregarLinea();
    component.lineas.at(1).patchValue({ productoId: 2, cantidad: 1 });
    component.onProductoSeleccionado(1);
    expect(component.totalEstimado()).toBe(3.5);

    // Guardar referencia al control cantidad de la línea 1 (que luego se eliminará)
    const removedCtrl = component.lineas.at(1).get('cantidad');

    // Eliminar la línea 1
    component.eliminarLinea(1);

    // Cambiar el valor del control ya removido — no debe afectar el total
    removedCtrl!.setValue(5);
    expect(component.totalEstimado()).toBe(2); // solo la línea 0 con qty 1
  });

// ── T8 ─────────────────────────────────────────────────────────────────────

  it('T8: remaining lines still update totalEstimado after line removal', () => {
    // Tres líneas iniciales con productos disponibles en el stub
    component.lineas.at(0).patchValue({ productoId: 1, cantidad: 1 });
    component.onProductoSeleccionado(0);
    component.agregarLinea();
    component.lineas.at(1).patchValue({ productoId: 2, cantidad: 1 });
    component.onProductoSeleccionado(1);
    component.agregarLinea();
    // Producto 3 no está en el stub, su precio es 0
    component.lineas.at(2).patchValue({ productoId: 1, cantidad: 1 });
    component.onProductoSeleccionado(2);
    expect(component.totalEstimado()).toBe(5.5); // 2.00 + 1.50 + 2.00

    // Eliminar la línea central (índice 1, que tiene producto 2)
    component.eliminarLinea(1);

    // Cambiar cantidad de una línea restante (índice 0 ahora)
    component.lineas.at(0).get('cantidad')!.setValue(3);
    // Total: 3 × 2.00 (línea 0) + 2.00 (línea 2, que ahora está en posición 0 después de remover)
    // Wait - after removing index 1, line 2 shifts to index 0, and line 0 stays at index 0? Let's check Angular behavior.
    // Angular FormArray.removeAt shifts subsequent elements down, so after removing index 1:
    // - Former index 2 becomes new index 1, not 0
    // - Index 0 remains the original line 0
    // So: line 0 (producto 1, qty 3) = 6.0, line 1 (producto 1, qty 1) = 2.0, total = 8.0
    expect(component.totalEstimado()).toBe(8);
  });

// ── T9 ─────────────────────────────────────────────────────────────────────

  it('T9: destruir fixture ejecuta cleanup de suscripciones', () => {
    // Espiar el método unsubscribe de Subscription
    const unsubscribeSpy = vi.spyOn(Subscription.prototype, 'unsubscribe');

    // Configurar: una línea con producto y cantidad
    component.lineas.at(0).patchValue({ productoId: 1, cantidad: 1 });
    component.onProductoSeleccionado(0);
    fixture.detectChanges();

    // Elimiar la línea
    component.eliminarLinea(0);

    // Destruir el fixture - esto debería desencadenar ngOnDestroy()
    fixture.destroy();

    // Verificar que unsubscribe fue llamado (al menos una vez por la limpieza)
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
