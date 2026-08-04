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

Siguiente acción para mañana: revisar el estado del proyecto y escoger una única microtarea pequeña de Fase 3.