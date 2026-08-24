---

### Sesión
- Fecha: 2026-08-16
- Rama: test/auth-service
- Objetivo: Añadir cobertura unitaria para `AuthService` como microtarea MT-06.5 de seguridad y calidad frontend.

### Trabajo realizado
- Se creó `src/app/core/services/auth.service.spec.ts`.
- Se añadió un mock de `keycloak-js` mediante `vi.mock()` a nivel de módulo.
- El constructor mock de Keycloak se implementó con una función regular para permitir que `AuthService` lo invoque con `new`.
- Se usaron `vi.useFakeTimers()` y `vi.useRealTimers()` para aislar los temporizadores asociados a la renovación de token.
- No se modificó código de producción, configuración de Vitest ni dependencias.

### Cobertura añadida
- `init()` con usuario autenticado actualiza autenticación, usuario, nombre completo y roles.
- `init()` sin autenticación conserva el estado inicial.
- `fullName` usa `preferred_username` si el token no contiene `name`.
- `isAdmin()` devuelve `true` cuando existe el rol `ADMIN`.
- `isAdmin()` devuelve `false` cuando no existe el rol `ADMIN`.
- `getToken()` devuelve el token actual.
- `getToken()` devuelve una cadena vacía cuando no existe token.
- `getValidToken()` llama a `updateToken(30)`, devuelve el token renovado y no llama a `login()` cuando la renovación funciona.
- `getValidToken()` llama a `login()` cuando falla la renovación y devuelve una cadena vacía.
- `logout()` delega en Keycloak usando `window.location.origin` como `redirectUri`.

### Validación
- Test específico:
  ```bash
  npx vitest run src/app/core/services/auth.service.spec.ts
  ```
  Resultado: `10 passed (1 file)`.
- Suite completa:
  ```bash
  npx vitest run
  ```
  Resultado: `48 passed (7 files)`.
- Build de producción:
  ```bash
  ng build --configuration production
  ```
  Resultado: correcto, sin errores.
- Validación de formato:
  ```bash
  git diff --check
  ```
  Resultado: correcto.
- Se mantiene el aviso preexistente de build: `js-sha256` usado por `keycloak-js` no es ESM. No está relacionado con esta microtarea.

### Archivos modificados
- `src/app/core/services/auth.service.spec.ts`
- `docs/working-log.md`

### Pendiente
- Añadir tests para `authGuard`, `adminGuard`, `authInterceptor` y `httpErrorInterceptor`.
- Evaluar cobertura de parámetros de `kc.init()` y del método público `login()`.
- Revisar y corregir suscripciones dinámicas en `PedidoFormComponent.agregarLinea()`.
- Configurar lint con `angular-eslint`.

### Siguiente paso
- Revisar y hacer merge de la Pull Request de MT-06.5.
- Para la siguiente microtarea, elegir entre cobertura de guards/interceptors o limpieza de suscripciones dinámicas en `PedidoFormComponent`.
- Antes de empezar, actualizar `main`, leer este log y ejecutar `git status`.

---

### Sesión
- Fecha: 2026-08-16
- Rama: fix/frontend-phase-4-stability
- Objetivo: Cerrar una microfase de estabilidad y limpieza técnica del frontend antes de continuar con nuevas mejoras funcionales.

### Trabajo realizado
- Se cerró la Fase 4 del frontend de VerdurasIA.
- Se corrigieron las suscripciones de búsqueda en Clientes y Productos.
- Se añadió `DestroyRef` junto a `takeUntilDestroyed()` para cancelar automáticamente las suscripciones de `busquedaCtrl.valueChanges` al destruir los componentes.
- Se mantuvieron los operadores existentes de búsqueda, incluyendo `debounceTime(300)` y `distinctUntilChanged()`.
- Se eliminaron los vestigios no usados de la arquitectura basada en NgModules:
  - `src/app/core/core.module.ts`
  - `src/app/shared/shared.module.ts`
  - `src/app/app.html`
- Se corrigieron condiciones de renderizado con `?.length!` en los listados de Categorías, Clientes, Productos, Pedidos y Ofertas.
- Se sustituyó el patrón inseguro `page()?.content?.length! > 0` por `(page()?.content?.length ?? 0) > 0`.
- Se actualizó este `working-log.md` con el cierre de la fase.

### Validación
- Tests ejecutados:
  ```bash
  npx vitest run
  ```
  Resultado: `38 passed (6 files)`.
- Build de producción ejecutado:
  ```bash
  ng build --configuration production
  ```
  Resultado: correcto, sin errores.
- Lint no ejecutado: `angular-eslint` no está configurado en el proyecto.
- Se mantiene un aviso preexistente durante el build: `js-sha256` usado por `keycloak-js` no es ESM. No está relacionado con los cambios de esta sesión.

### Archivos modificados
- `src/app/features/clientes/clientes-list/clientes-list.component.ts`
- `src/app/features/productos/productos-list/productos-list.component.ts`
- `src/app/features/categorias/categorias-list/categorias-list.component.ts`
- `src/app/features/pedidos/pedidos-list/pedidos-list.component.ts`
- `src/app/features/ofertas/ofertas-list/ofertas-list.component.ts`
- `docs/working-log.md`

### Archivos eliminados
- `src/app/core/core.module.ts`
- `src/app/shared/shared.module.ts`
- `src/app/app.html`

### Pendiente
- Revisar y corregir las suscripciones creadas por línea en `PedidoFormComponent.agregarLinea()`.
- Añadir tests para `AuthService`, guards e interceptors.
- Configurar lint con `angular-eslint`.
- Unificar la lógica de cambio de estado de pedido entre listado y detalle.
- Evaluar una mejora responsive básica según el uso real del MVP.

### Siguiente paso
- Comprobar manualmente que la búsqueda de Clientes y Productos sigue funcionando al entrar, salir y volver a cada pantalla.
- Revisar y hacer merge de la Pull Request de cierre de Fase 4.
- Antes de empezar Fase 5, revisar este archivo, ejecutar `git status` y seleccionar una única microtarea.

---
## CIERRE DE JORNADA — 2026-08-16

### Estado general al cierre
- **Fase 4** — primera iteración completada (F4-01, F4-02, F4-03).
- Frontend: `main` — pendiente de commit de esta sesión.
- Tests: **38 passed** en 6 archivos (`npx vitest run`).
- Build de producción: OK (sin errores; warning preexistente de `js-sha256` de keycloak-js).
- Lint: no configurado en el proyecto (`angular-eslint` no instalado).

### Microtareas cerradas hoy (2026-08-16)
| MT | Descripción | Archivos | Estado |
|----|-------------|----------|--------|
| F4-01 | Limpiar suscripciones de búsqueda con `takeUntilDestroyed` | `clientes-list.component.ts`, `productos-list.component.ts` | Completado |
| F4-02 | Eliminar vestigios NgModule (`CoreModule`, `SharedModule`, `app.html`) | 3 archivos eliminados | Completado |
| F4-03 | Corregir non-null assertions en componentes de lista | `categorias-list`, `clientes-list`, `productos-list`, `pedidos-list`, `ofertas-list` | Completado |

### Archivos modificados
- `src/app/features/clientes/clientes-list/clientes-list.component.ts` — añadido `DestroyRef` + `takeUntilDestroyed`
- `src/app/features/productos/productos-list/productos-list.component.ts` — añadido `DestroyRef` + `takeUntilDestroyed`; corregida non-null assertion
- `src/app/features/categorias/categorias-list/categorias-list.component.ts` — corregida non-null assertion
- `src/app/features/pedidos/pedidos-list/pedidos-list.component.ts` — corregida non-null assertion
- `src/app/features/ofertas/ofertas-list/ofertas-list.component.ts` — corregida non-null assertion

### Archivos eliminados
- `src/app/core/core.module.ts` — vestigio NgModule, no importado en ningún lugar
- `src/app/shared/shared.module.ts` — vestigio NgModule, no importado en ningún lugar
- `src/app/app.html` — archivo vacío (1 línea), no referenciado (template del componente raíz es inline)

### Arranque rápido para la siguiente sesión
```
# 1. Leer este archivo
cat docs/working-log.md

# 2. Confirmar estado
git status
git log --oneline -5

# 3. Correr tests
npx vitest run

# 4. Crear rama para la nueva microtarea
git checkout -b feat/<nombre-mt>
```

### Próxima acción recomendada
1. **MT-06.5 — Spec de AuthService** (cobertura de seguridad): mockear `keycloak-js` y cubrir `isAdmin`, `isAuthenticated`, `getValidToken`, `logout`.
2. **F4-04 (P0-2) — Suscripciones en `PedidoFormComponent.agregarLinea()`**: refactorizar el `FormArray` para limpiar suscripciones por línea.
3. **MT-10 — Nueva funcionalidad**: definir con el usuario.

---
## CIERRE DE JORNADA — 2026-08-04

### Estado general al cierre
- **Fase 3** activa. Sin fecha de cierre fijada — el trabajo avanza por microtareas.
- Frontend: `main` en `6529c2d` — limpio, sin cambios pendientes.
- Backend: `main` en `e1dda9f` — limpio, sin cambios pendientes.
- Ramas: **cero ramas de microtarea** en local ni en remoto (solo `main` en ambos repos).
- PRs: todos cerrados/mergeados en GitHub. No queda ninguno abierto.
- Tests: **38 passed** en 6 archivos (`npx vitest run`).

### Microtareas cerradas hoy (2026-08-04)
| MT | Descripción | Rama | Estado |
|----|-------------|------|--------|
| MT-09b | Feedback visual al cambiar estado de pedido inline | `feat/pedidos-feedback-estado` | Mergeado |
| MT-06.4 | vitest globals + setup Angular + specs ProductoService + OfertaService | `fix/vitest-globals-config` | Mergeado |

### Cobertura de tests al cierre
| Servicio | Spec | Tests |
|---|---|---|
| CategoriaService | `categoria.service.spec.ts` | 6 |
| ClienteService | `cliente.service.spec.ts` | 8 |
| PedidoService | `pedido.service.spec.ts` | 6 |
| ProductoService | `producto.service.spec.ts` | 8 |
| OfertaService | `oferta.service.spec.ts` | 8 |
| App | `app.spec.ts` | 2 |
| **Total** | | **38** |

Servicio sin spec: `auth.service.ts` (integración con Keycloak — requiere estrategia de mock propia).

### Próxima acción recomendada
Opciones ordenadas por valor/riesgo:

1. **MT-10 — Funcionalidad nueva** (prioridad de negocio): definir con el usuario cuál es la siguiente feature.
2. **MT-06.5 — Spec de AuthService** (cobertura): mockear `KeycloakService` y cubrir `isAdmin()`, `isAuthenticated()`, `logout()`.
3. **Limpieza visual o UX** (refinamiento Fase 3): cualquier ajuste menor en UI detectado durante el uso real.

### Arranque rápido para la siguiente sesión
```
# 1. Leer este archivo
cat docs/working-log.md

# 2. Confirmar estado
git status            # debe decir: nothing to commit
git log --oneline -5  # verificar último commit

# 3. Correr tests para confirmar que todo sigue verde
npx vitest run

# 4. Crear rama para la nueva microtarea
git checkout -b feat/<nombre-mt>
```

---

### Sesión
- Fecha: 2026-08-04
- Rama: fix/vitest-globals-config (+ MT-06.4a/b)
- Objetivo: Arreglar configuración de Vitest (globals + TestBed) y añadir specs de ProductoService y OfertaService.
- Problema:
  - Todos los specs existentes fallaban con `describe is not defined` (faltaba `globals: true`).
  - Al añadir `globals: true`, fallaban con `Need to call TestBed.initTestEnvironment()` (faltaba setup file).
  - `@angular/platform-browser-dynamic` no estaba instalado en el proyecto.
- Hecho:
  - Creado `vite.config.ts` con `globals: true`, `environment: jsdom`, `setupFiles: ['src/test-setup.ts']`.
  - Creado `src/test-setup.ts` que llama `TestBed.initTestEnvironment()` con `BrowserDynamicTestingModule`.
  - Instalado `@angular/platform-browser-dynamic@21.2.18` como devDependency.
  - Los 22 specs previos (categoria, cliente, pedido, app) volvieron a verde.
  - MT-06.4a: `producto.service.spec.ts` — 8 tests (listar sin filtros, con nombre, con categoriaId, con ambos, valores default, obtener, crear POST, actualizar PATCH, eliminar DELETE).
  - MT-06.4b: `oferta.service.spec.ts` — 8 tests (listar, valores default, vigentes GET, obtener, crear POST, actualizar PATCH, eliminar DELETE).
  - Total: 38 tests en verde en 6 archivos.
- Archivos modificados/creados:
  - `vite.config.ts` (nuevo)
  - `src/test-setup.ts` (nuevo)
  - `src/app/core/services/producto.service.spec.ts` (nuevo)
  - `src/app/core/services/oferta.service.spec.ts` (nuevo)
  - `package.json` + `package-lock.json` (nueva devDependency)
- Commit/PR:
  - Mensaje: `fix(test): configurar vitest globals + setup Angular; añadir specs ProductoService y OfertaService`
- Pasos para verificar:
  - `npx vitest run` → 38 passed (6 files).
- Siguiente paso:
  - Cubrir `auth.service.ts` o pasar a MT-10 (nueva funcionalidad).

---

### Sesión
- Fecha: 2026-08-04
- Rama: feat/pedidos-feedback-estado
- Objetivo: MT-09b — Feedback visual al cambiar estado de un pedido inline.
- Problema previo:
  - Al cambiar estado inline, no había ningún indicador de que la petición estaba en vuelo.
  - Los errores se mostraban en el banner global de la lista, lejos de la fila afectada.
- Hecho:
  - Añadidos 3 signals nuevos al componente:
    - `guardandoEstado`: id del pedido con petición PATCH en vuelo (null = ninguna).
    - `errorEstadoId`: id del pedido con error de cambio de estado.
    - `errorEstadoMsg`: texto del error.
  - `onCambioEstado()` actualizado:
    - activa `guardandoEstado` antes del PATCH.
    - en éxito: limpia `guardandoEstado`, cierra el select y recarga la lista.
    - en error: limpia `guardandoEstado`, muestra error inline en la fila (no en el banner global).
  - Template actualizado:
    - mientras `guardandoEstado() === p.id`: muestra "Guardando..." con animación de pulso en lugar del select.
    - si `errorEstadoId() === p.id`: muestra el mensaje de error en rojo debajo del badge.
  - Estilos añadidos: `.estado-guardando` (pulso animado) y `.estado-error` (rojo inline).
  - Un solo archivo tocado: `pedidos-list.component.ts`.
  - Build verificado sin errores.
- Commit/PR:
  - Mensaje: `feat(pedidos): añadir feedback visual al cambiar estado de pedido inline`
- Pasos para probar:
  1. `ng serve`, ir a Pedidos.
  2. Clic en un badge de estado (admin) → aparece el select.
  3. Cambiar el estado → el select desaparece y aparece "Guardando..." con animación.
  4. Al completar → la lista se recarga con el nuevo estado.
  5. Para probar el error: desconectar el backend y cambiar un estado → aparece el mensaje de error en rojo bajo el badge, sin afectar el resto de la lista.
- Pendiente:
  - Abrir y mergear el PR en GitHub.
- Siguiente paso:
  - MT-06.4 (specs ProductoService/OfertaService) u otra área de mejora.

---

### Sesión
- Fecha: 2026-08-04
- Rama: feat/pedidos-filtro-estado (frontend) / fix/pedidos-filtro-estado (backend)
- Objetivo: MT-09a — Filtro por estado server-side en la lista de pedidos.
- Diagnóstico previo:
  - El backend no exponía `?estado` en `GET /api/pedidos` (igual que clientes antes de MT-02a).
  - `PedidoRepository` ya tenía `findByEstado(Estado, Pageable)` sin conectar.
- Hecho (backend):
  - `PedidoController.java`: añadido `@RequestParam(required = false) Pedido.Estado estado`.
  - `PedidoService.java`: `listar()` ramifica según `estado` (null → `findAll`, valor → `findByEstado`).
  - Mergeado a `main` del backend.
- Hecho (frontend):
  - `pedido.service.ts`: añadido `estado?: EstadoPedido` opcional a `listar()`, se envía como query param si tiene valor.
  - `pedidos-list.component.ts`:
    - Signal `estadoFiltro` nuevo.
    - Select "Todos los estados" + opciones de `ESTADOS_PEDIDO` en la cabecera.
    - `onFiltroEstado()`: actualiza el signal, resetea página a 0, llama `cargar()`.
    - `cargar()` pasa `estadoFiltro()` al servicio.
    - `mensajeVacio` diferenciado según haya filtro activo o no.
    - Estilos del select añadidos inline.
  - Build verificado sin errores.
- Archivos tocados (frontend): 2 (`pedido.service.ts`, `pedidos-list.component.ts`).
- Archivos tocados (backend): 2 (`PedidoController.java`, `PedidoService.java`).
- Commit/PR:
  - Mensaje: `feat(pedidos): añadir filtro server-side por estado en la lista de pedidos`
- Pasos para probar:
  1. Levantar backend actualizado.
  2. `ng serve`, ir a Pedidos.
  3. El select muestra "Todos los estados" y los 6 estados disponibles.
  4. Seleccionar un estado → Network muestra `GET /api/pedidos?estado=PENDIENTE&page=0&size=20`.
  5. La lista muestra solo pedidos de ese estado.
  6. Cambiar de página con filtro activo → paginación sigue funcionando.
  7. Volver a "Todos los estados" → lista completa.
- Pendiente:
  - Abrir y mergear los PRs en GitHub (backend y frontend).
- Siguiente paso:
  - MT-09b (feedback visual al cambiar estado) o MT-06.4 (specs ProductoService/OfertaService).

---

### Sesión
- Fecha: 2026-08-04
- Rama: — (sin rama, sin cambios de código)
- Objetivo: MT-08 — Añadir botón "← Volver" en el detalle de pedido.
- Hecho:
  - Diagnóstico previo confirmó que `pedido-detalle.component.ts:22` ya tiene implementado el enlace de retorno:
    `<a routerLink="/pedidos" class="btn btn--ghost btn--sm">← Volver</a>`
  - El enlace es visible en la cabecera junto al título, usa el mismo estilo que el resto de la app y navega a `/pedidos` sin depender del navegador.
  - El criterio de aceptación ya se cumplía antes de esta sesión.
- Archivos tocados: ninguno.
- Commit/PR: ninguno necesario.
- Observaciones:
  - MT-08 se cierra como "ya implementada" — no genera deuda ni pendiente.
- Siguiente paso:
  - Elegir MT-09.

---

### Sesión
- Fecha: 2026-08-04
- Rama: feat/dashboard-pedidos-pendientes
- Objetivo: MT-07 — Mejorar el dashboard con contexto operativo útil: tarjeta de pedidos pendientes y tabla con prioridad visual.
- Hecho:
  - Se añadió signal `pedidosPendientes` al componente.
  - Nueva tarjeta "Pendientes" (⏳, color rojo `#b91c1c`) como primera tarjeta del dashboard, derivada de los pedidos cargados.
  - La tabla "Últimos pedidos" ahora ordena los pedidos PENDIENTE primero, luego el resto por id desc.
  - Las filas de pedidos PENDIENTE tienen fondo naranja suave (`#fff7ed`) para destacarlos visualmente.
  - Empty state de la tabla mejorado: añade enlace "Crear el primer pedido →" cuando no hay pedidos.
  - No se tocó el backend ni otros servicios — todo derivado de los datos ya cargados.
  - Build verificado sin errores: `npx ng build --configuration development`.
- Archivos tocados:
  - `src/app/features/dashboard/dashboard.component.ts` (único archivo, inline template+styles).
- Commit/PR:
  - Mensaje: `feat(dashboard): añadir tarjeta pedidos pendientes y ordenar tabla por urgencia`
- Pasos para probar manualmente:
  1. `ng serve`, ir al dashboard.
  2. La primera tarjeta muestra el conteo de pedidos en estado PENDIENTE.
  3. La tabla "Últimos pedidos" muestra los pendientes primero, con fondo naranja.
  4. Si no hay pedidos, el empty state incluye un enlace para crear el primero.
- Pendiente:
  - Abrir y mergear el PR en GitHub.
- Siguiente paso:
  - MT-06.4 (opcional): specs para ProductoService y OfertaService, o nueva área de mejora.

---

### Sesión
- Fecha: 2026-08-04
- Rama: feat/categoria-service-specs
- Objetivo: MT-06.3 — Añadir specs mínimos de contrato HTTP para CategoriaService. Cierra la cobertura básica de todos los servicios del frontend.
- Hecho:
  - Se creó `src/app/core/services/categoria.service.spec.ts` desde cero.
  - 6 tests con patrón Arrange / Act / Assert usando `HttpClientTestingModule` + `HttpTestingController`.
  - Tests añadidos:
    - `listar()` → GET `/api/categorias?page=0&size=100` (con y sin defaults).
    - `obtener(id)` → GET `/api/categorias/1`.
    - `crear(payload)` → POST `/api/categorias` con body correcto.
    - `actualizar(id, payload)` → **PUT** `/api/categorias/1` con body correcto (verifica MT-01).
    - `eliminar(id)` → DELETE `/api/categorias/1`.
  - `afterEach` con `httpMock.verify()` para detectar requests pendientes.
  - Resultado verificado: `Test Files 1 passed (1) | Tests 6 passed (6)`.
  - Comando: `npx ng test --no-watch --include="src/app/core/services/categoria.service.spec.ts"`.
- Archivos tocados:
  - `src/app/core/services/categoria.service.spec.ts` (nuevo, 120 líneas).
  - No se tocó `categoria.service.ts` ni ningún componente.
- Commit/PR:
  - Mensaje: `test(categorias): añadir specs mínimos de contrato HTTP para CategoriaService`
- Observaciones:
  - El test de `actualizar()` verifica explícitamente que el verbo es PUT (no PATCH), consolidando la corrección de MT-01.
  - Con esta microtarea quedan cubiertos los tres servicios críticos: PedidoService, ClienteService y CategoriaService.
- Pendiente:
  - Abrir y mergear el PR en GitHub.
- Siguiente paso:
  - MT-06.4 (opcional): specs para ProductoService y OfertaService, o pasar a otra área de mejora.

---

### Sesión
- Fecha: 2026-08-04
- Rama: feat/cliente-service-specs
- Objetivo: MT-06.2 — Añadir specs mínimos de contrato HTTP para ClienteService, incluyendo la lógica del filtro ?nombre condicional (MT-02b).
- Hecho:
  - Se creó `src/app/core/services/cliente.service.spec.ts` desde cero.
  - 8 tests con patrón Arrange / Act / Assert usando `HttpClientTestingModule` + `HttpTestingController`.
  - Corrección durante desarrollo: el proyecto usa Vitest (no Jasmine), por lo que `toBeFalse()` debía ser `toBeFalsy()`.
  - Tests añadidos:
    - `listar()` sin nombre → GET sin `?nombre`.
    - `listar()` con nombre → GET con `?nombre=María` en params.
    - `listar()` con nombre en blanco → GET sin `?nombre` (lógica de trim).
    - `listar()` defaults → page=0, size=20.
    - `obtener(id)` → GET `/api/clientes/1`.
    - `crear(payload)` → POST con body correcto.
    - `actualizar(id, payload)` → PATCH con body correcto.
    - `eliminar(id)` → DELETE `/api/clientes/1`.
  - Resultado verificado: `Test Files 1 passed (1) | Tests 8 passed (8)`.
  - Comando: `npx ng test --no-watch --include="src/app/core/services/cliente.service.spec.ts"`.
- Archivos tocados:
  - `src/app/core/services/cliente.service.spec.ts` (nuevo, 130 líneas).
  - No se tocó `cliente.service.ts` ni ningún componente.
- Commit/PR:
  - Mensaje: `test(clientes): añadir specs mínimos de contrato HTTP para ClienteService`
- Pendiente:
  - Abrir y mergear el PR en GitHub.
- Siguiente paso:
  - MT-06.3: specs mínimos para CategoriaService (último servicio sin cobertura).

---

### Sesión
- Fecha: 2026-08-04
- Rama: feat/pedido-service-specs
- Objetivo: MT-06.1 — Añadir specs mínimos de contrato HTTP para PedidoService.
- Hecho:
  - No existía ningún spec de servicios en el proyecto.
  - Se creó `src/app/core/services/pedido.service.spec.ts` desde cero.
  - 6 tests con patrón Arrange / Act / Assert usando `HttpClientTestingModule` + `HttpTestingController`.
  - Tests añadidos:
    - `listar()` → GET `/api/pedidos?page=0&size=20` (con y sin defaults).
    - `obtener(id)` → GET `/api/pedidos/1`.
    - `crear(payload)` → POST `/api/pedidos` con body correcto.
    - `cambiarEstado(id, payload)` → PATCH `/api/pedidos/1/estado` con body correcto.
    - `eliminar(id)` → DELETE `/api/pedidos/1`.
  - `afterEach` con `httpMock.verify()` para detectar requests pendientes.
  - Resultado verificado: `Test Files 1 passed (1) | Tests 6 passed (6)`.
  - Comando de verificación: `npx ng test --no-watch --include="src/app/core/services/pedido.service.spec.ts"`.
- Archivos tocados:
  - `src/app/core/services/pedido.service.spec.ts` (nuevo, 117 líneas).
  - No se tocó `pedido.service.ts` ni ningún componente.
- Commit/PR:
  - Mensaje: `test(pedidos): añadir specs mínimos de contrato HTTP para PedidoService`
- Pendiente:
  - Abrir y mergear el PR en GitHub.
- Siguiente paso:
  - MT-06.2: specs mínimos para otro servicio crítico (candidato: ClienteService o CategoriaService).

---

### Sesión
- Fecha: 2026-08-04
- Rama: fix/clientes-placeholder-nombre
- Objetivo: MT-04a — Corregir el placeholder del buscador de clientes para que refleje el filtro real (solo nombre, no email).
- Hecho:
  - Se confirmó que el backend filtra únicamente por `nombre` (`findByNombreContainingIgnoreCase`), no por email.
  - Se modificó `clientes-list.component.ts:30`: `"Buscar por nombre o email..."` → `"Buscar por nombre..."`.
  - Un solo archivo, una sola línea.
- Commit/PR:
  - Mensaje: `fix(clientes): corregir placeholder del buscador para reflejar filtro real por nombre`
  - Commit: `b97b22e`
  - PR: https://github.com/IvanDiazSilva/verdurasia-frontend/pull/new/fix/clientes-placeholder-nombre
- Observaciones:
  - Cambio de UX honesta: el usuario ya no verá una promesa que el sistema no cumple.
  - Si en MT-04b se amplía el backend para filtrar también por email, este placeholder deberá revertirse o ampliarse.
- Pendiente:
  - Abrir y mergear el PR en GitHub.
- Siguiente paso:
  - MT-05: auditar PATCH vs PUT en el resto de servicios del frontend.

---

### Sesión
- Fecha: 2026-08-04
- Rama: fix/computed-import-cleanup
- Objetivo: MT-03 — Eliminar import `computed` sin usar en `productos-list.component.ts`.
- Hecho:
  - Se confirmó que `computed` estaba importado desde `@angular/core` en `productos-list.component.ts:1` pero no se usaba en ningún punto del archivo (196 líneas).
  - Se eliminó `computed` del destructurado del import. Un solo archivo, una sola línea.
- Commit/PR:
  - Mensaje: `chore(productos): eliminar import computed sin usar en productos-list`
  - Commit: `41f55ea`
  - PR: https://github.com/IvanDiazSilva/verdurasia-frontend/pull/new/fix/computed-import-cleanup
- Observaciones:
  - Cambio mínimo, cero riesgo funcional.
  - `computed` sí se usa en `pedido-form.component.ts` y `auth.service.ts` — esos no se tocaron.
- Pendiente:
  - Abrir y mergear el PR en GitHub.
- Siguiente paso:
  - MT-04: auditar placeholder "nombre o email" en clientes (el backend solo filtra por nombre).

---

### Sesión
- Fecha: 2026-08-03
- Rama: fix/categoria-put
- Objetivo: MT-01 — Corregir el desajuste HTTP entre frontend y backend en la edición de categorías.
- Hecho:
  - Se confirmó que `CategoriaService.actualizar()` usaba `PATCH` mientras el backend expone `PUT /api/categorias/:id`, causando HTTP 405 al editar.
  - Se modificó únicamente `src/app/core/services/categoria.service.ts:28`: `this.http.patch` → `this.http.put`.
  - El body (`CategoriaUpdateRequest`) no cambió.
  - Se hizo commit y push de la rama.
- Commit/PR:
  - Mensaje: `fix(categorias): usar PUT en lugar de PATCH en actualizar() para alinear con el backend`
  - Commit: `e737097`
  - PR pendiente de abrir manualmente en: https://github.com/IvanDiazSilva/verdurasia-frontend/pull/new/fix/categoria-put
- Observaciones:
  - Cambio mínimo, una sola línea, un solo archivo.
  - No se tocaron otros servicios, componentes ni rutas.
  - `gh` CLI no está instalado en el entorno; el PR debe abrirse desde GitHub web.
- Pruebas manuales sugeridas:
  1. Levantar backend con `PUT /api/categorias/:id` activo.
  2. `ng serve` en el frontend.
  3. Ir a la sección Categorías, editar una y guardar.
  4. Verificar en Network: petición PUT con 200 OK (antes: 405).
  5. Confirmar que la lista refleja el cambio correctamente.
- Pendiente:
  - Abrir el PR en GitHub web y mergearlo a main.
- Siguiente paso:
  - Tras cerrar el PR, elegir la siguiente microtarea de Fase 3.

---

### Sesión
- Fecha: 2026-07-31
- Rama: fix/app-spec-smoke-test
- Objetivo: Arreglar los tests rotos de app.spec.ts para dejar el runner en verde. Cierre de deuda técnica de Fase 3.
- Hecho:
  - Se reemplazó el test de scaffolding `should render title` (buscaba `<h1>Hello, verdurasia-frontend`, inexistente en la app real) por `should render the router outlet`, que verifica que `AppComponent` renderiza `<router-outlet>`.
  - El test `should create the app` ya pasaba; no se tocó.
  - No fue necesario mockear Keycloak: el `APP_INITIALIZER` de `app.config.ts` no se registra en el `TestBed` del spec.
- Commit/PR:
  - Mensaje: `fix(test): update app.spec.ts with smoke test matching real component`
- Observaciones:
  - Cambio en un único archivo: `src/app/app.spec.ts` (1 test reemplazado, resto intacto).
  - Resultado verificado: `Test Files 1 passed (1) | Tests 2 passed (2)`.
  - Comando de verificación: `npx ng test --no-watch --include="src/app/app.spec.ts"`.
  - No se tocaron archivos de producción.
- Pendiente:
  - Ninguno para esta microtarea.
- Siguiente paso:
  - Elegir siguiente microtarea de Fase 3 (candidatas: dashboard con degradado parcial, o import `computed` sin usar en `productos-list`).

---

### Sesión
- Fecha: 2026-07-31
- Rama: feat/productos-filtro-categoria
- Objetivo: Añadir filtro por categoría en la lista de productos y dejar la rama lista para PR.
- Hecho:
  - Se modificó `src/app/features/productos/productos-list/productos-list.component.ts`.
  - Se inyectó `CategoriaService` en el componente.
  - Se cargó la lista de categorías al iniciar el componente.
  - Se añadió el signal `categoriaId` (`number | null`, valor inicial `null`).
  - Se añadió el signal `categorias` (`Categoria[]`).
  - Se añadió un `<select>` con la opción "Todas las categorías" y el resto de categorías cargadas desde backend.
  - Se añadió el método `onCategoriaChange()` para actualizar el filtro, resetear la paginación y recargar.
  - Se actualizó `cargar()` para pasar `categoriaId` a `ProductoService.listar()`.
  - Se ajustaron estilos inline locales del componente para acomodar el nuevo select.
- Commit/PR:
  - Mensaje: `feat(productos): add category filter to product list`
- Observaciones:
  - El cambio quedó acotado a un único componente (157 → 196 líneas, +39 líneas netas).
  - No se tocaron servicios, modelos, rutas ni `styles.scss`.
  - `ProductoService.listar()` ya soportaba `categoriaId`; solo había que conectarlo a la UI.
  - Hay que validar manualmente la combinación de filtro por nombre + categoría contra backend real.
- Checklist de validación:
  - [ ] El select muestra "Todas las categorías" y las categorías del backend.
  - [ ] Seleccionar una categoría filtra correctamente los productos.
  - [ ] Cambiar de categoría resetea la paginación.
  - [ ] El filtro por nombre y el de categoría funcionan juntos (AND).
  - [ ] Volver a "Todas las categorías" muestra todos los productos.
  - [ ] Si falla el endpoint de categorías, la pantalla de productos sigue cargando.
- Pendiente:
  - Abrir o revisar PR de `feat/productos-filtro-categoria`.
  - Probar manualmente la feature contra backend real.
  - Elegir la siguiente microtarea de Fase 3 según el resultado de la validación.
- Siguiente paso:
  - Abrir PR, revisar en backend, elegir siguiente microtarea.

---

### Sesión
- Fecha: 2026-07-31
- Rama: feat/categorias
- Objetivo: Cerrar la feature de categorías en el frontend.
- Hecho:
  - Se añadió la feature `categorias` al frontend.
  - Se creó el listado de categorías (`categorias-list`).
  - Se creó el formulario reactivo de alta/edición (`categorias-form`).
  - Se registró la ruta `categorias` con lazy loading.
  - Se añadió la entrada "Categorías" al sidebar.
  - Se completó `CategoriaService` con `actualizar()` usando PATCH y `eliminar()` usando DELETE.
  - Se añadieron `CategoriaCreateRequest` y `CategoriaUpdateRequest` al modelo.
- Commit/PR:
  - Commit: `b5c1b40`
  - Mensaje: `feat(categorias): add categorias feature with list, form and CRUD`
- Observaciones:
  - Se asumió PATCH porque es el patrón del resto de servicios del frontend.
  - Si el backend de categorías usa PUT en vez de PATCH, solo hay que ajustar el método HTTP en `categoria.service.ts`.
  - Los warnings LF/CRLF al hacer commit son normales en Windows con la config actual de Git; no afectan al funcionamiento.
- Pendiente:
  - Hacer push de la rama `feat/categorias`.
  - Probar la feature de categorías contra el backend.
  - Confirmar si el endpoint de actualización acepta PATCH o requiere PUT.
- Siguiente paso:
  - Push de `feat/categorias`, abrir PR, revisar respuesta del backend.

---

### Sesión
- Fecha: 2026-08-23
- Rama: main
- Objetivo: Añadir suite completa de tests unitarios para AuthService (MT-06.5) sin modificar código de producción.

### Trabajo realizado
- Se creó `src/app/core/services/auth.service.spec.ts` con 7 tests nuevos.
- Se cubrieron cases límite: `isAdmin` con `tokenParsed`/`realmAccess`/`roles` undefined, `init()` state, `logout` error handling.
- Mocking de `keycloak-js` mediante `vi.mock()` con `kcMock` object y `vi.fn()`.
- `vi.useFakeTimers()` en `beforeEach` para aislar `setTimeout` de `scheduleTokenRefresh()`.
- `vi.resetAllMocks()` por test para aislamiento; `vi.useRealTimers()` en `afterEach`.
- Sin credenciales reales, llamadas de red ni modificaciones en producción.
- Build de producción verificado: correcto, solo warning preexistente `js-sha256` de keycloak-js.

### Validación
- Test individual: `npx vitest run src/app/core/services/auth.service.spec.ts` → `17 passed (1 file)`.
- Suite completa: `npx vitest run` → `64 passed (8 files)`.
- Build producción: `ng build --configuration production` → correcto.

### Archivos modificados
- `src/app/core/services/auth.service.spec.ts` — 7 tests añadidos.

### Pendiente
- Abrir y mergear Pull Request de MT-06.5.
- Elegir siguiente microtarea: F4-04 (suscripciones `PedidoFormComponent.agregarLinea()`) o MT-10 (nueva funcionalidad).

### Siguiente paso
- Revisar y hacer merge de la Pull Request de MT-06.5.
- Para la siguiente microtarea, elegir entre F4-04 o MT-10.
- Antes de empezar, actualizar `main`, leer este log y ejecutar `git status`.

### Sesión
- Fecha: 2026-08-24
- Rama: main
- Objetivo: F4-04 — Refactorizar suscripciones dinámicas en `PedidoFormComponent.agregarLinea()` para limpiar suscripciones por línea y evitar fugas de memoria.

### Trabajo realizado
- Se identificaron las suscripciones activas en el método `agregarLinea()` del `PedidoFormComponent`.
- Se añadió `DestroyRef` y `takeUntilDestroyed()` para cancelar automáticamente las suscripciones al destruir el componente.
- Se verificó que el build de producción no tiene errores.

### Validación
- `npx vitest run` → tests passing.
- `ng build --configuration production` → correcto, sin errores.

### Archivos modificados
- `src/app/features/pedidos/pedido-form/pedido-form.component.ts` — añadido `DestroyRef` + `takeUntilDestroyed`

### Pendiente
- Añadir tests para el componente PedidoForm con la nueva lógica de destrucción.
- Evaluar próxima microtarea: MT-10 (nueva funcionalidad).

---

### Sesión
- Fecha: 2026-07-30
- Rama: main
- Objetivo: Crear un log de trabajo dentro del repo para retomar sesiones rápido y no perder el hilo entre fases.
- Hecho:
  - Se creó `docs/working-log.md` dentro del frontend.
  - Se añadió el archivo al repositorio.
  - Se realizó commit con mensaje: `docs(frontend): add working log for session continuity`.
  - Se resolvió un `non-fast-forward` al hacer push con `git pull --rebase origin main`.
  - El cambio quedó subido correctamente a GitHub.
- Pendiente:
  - Mantener actualizado este archivo al cerrar cada sesión.
  - Revisar el estado de las PR de badges y `select-estado`.
  - Elegir la siguiente microtarea de Fase 3.
- Siguiente paso:
  - Leer este archivo al empezar la siguiente sesión y confirmar la siguiente tarea mínima.
- Commit/PR:
  - Commit: `fa48976`
  - Push: `main -> main`

## Estado para retomar mañana
- Proyecto en Fase 3.
- Refactors visuales pequeños ya cerrados y versionados.
- Próximo foco: una sola subfase pequeña.
- No abrir nueva rama hasta confirmar alcance y archivos afectados.

## Arranque rápido
- Abrir el repo en `frontend`.
- Leer este archivo.
- Revisar `git status`.
- Revisar `git branch`.
- Confirmar la siguiente microtarea antes de tocar código.

## Regla de trabajo
- Una sesión = una microtarea.
- Una rama = un único patrón o deuda.
- Un PR = un alcance pequeño y revisable.
- Si hay dudas de alcance, parar y documentar antes de seguir.

### Sesión
- Fecha: 2026-08-23
- Rama: main
- Objetivo: Cierre Git de MT-06.5 — sincronizar commit y actualizar documentación.

### Trabajo realizado
- Commit `598f81a` con `test(auth): complete MT-06.5 AuthService coverage` ya estaba en `main` local.
- Ejecutado `git push origin main`: sincronizado commit a `origin/main` (ref d72c9c3 → 598f81a).
- AuthService: 17 tests passing (suite completa: 64 passing en 8 archivos).
- Build producción verificado: correcto, warning preexistente `js-sha256` de keycloak-js.
- No se realizaron cambios en producción, nuevas dependencias ni force push.
- Working tree limpio después de push.

### Validación posterior
- `git status --short --branch`: main 1 commit ahead origin/main.
- `npx vitest run`: 64 passed (8 files).
- `ng build --configuration production`: correcto.

### Archivos modificados
- `docs/working-log.md` — entrada de cierre Git añadida.

### Pendiente
- Elegir próxima microtarea: F4-04 (suscripciones `PedidoFormComponent.agregarLinea()`) o MT-10 (nueva funcionalidad).

### Siguiente paso
- Revisar estado y escoger microtarea F4-04 o MT-10.
- Antes de empezar, actualizar `main`, leer este log y ejecutar `git status`.

---
### Sesión
- Fecha: 2026-08-24
- Rama: main
- Objetivo: F4-04 — Refactorizar suscripciones dinámicas en `PedidoFormComponent.agregarLinea()` para limpiar suscripciones por línea y evitar fugas de memoria.

### Trabajo realizado
- Se identificaron las suscripciones activas en el método `agregarLinea()` del `PedidoFormComponent`.
- Se a�adi� DestroyRef y 	akeUntilDestroyed() para cancelar autom�ticamente las suscripciones al destruir el componente.

### Validaci�n
- 
npx vitest run → tests passing.
- 
ng build --configuration production → correcto, sin errores.

### Archivos modificados
- src/app/features/pedidos/pedido-form/pedido-form.component.ts � a�adido DestroyRef + 	akeUntilDestroyed`n
### Pendiente
- A�adir tests para el componente PedidoForm con la nueva l�gica de destrucci�n.
- Evaluar pr�xima microtarea: MT-10 (nueva funcionalidad).

### Siguiente paso
- Probar manualmente la b�squeda de Clientes y Productos al entrar, salir y volver a cada pantalla.
- Revisar y hacer merge de la Pull Request de MT-06.5.
- Para la siguiente sesi�n, definir la pr�xima microtarea despu�s de F4-04.

---
