# VerdurasIA — Frontend

Interfaz web de VerdurasIA, una aplicación para la gestión de productos, categorías, clientes, pedidos y ofertas de una verdulería con asistencia de IA.

---

## Descripción

Frontend desarrollado con **Angular 21** (arquitectura standalone/funcional). Consume la API REST del backend de VerdurasIA. Incluye vistas para dashboard, productos, clientes, pedidos y ofertas con carga lazy por ruta.

---

## Requisitos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js     | 20 LTS         |
| npm         | 11.3.0+        |
| Angular CLI | 21.2.1+        |

Instalar Angular CLI globalmente (opcional, se puede usar `npx`):

```bash
npm install -g @angular/cli@21
```

---

## Instalación de dependencias

```bash
# Desde la carpeta frontend/
npm install
```

---

## Cómo arrancar en local

```bash
npm start
# o equivalentemente:
ng serve
```

---

## URL local

| Recurso | URL |
|---------|-----|
| Aplicación | `http://localhost:4200` |

La aplicación recarga automáticamente al guardar cambios en los archivos fuente.

---

## Conexión con el backend

En desarrollo, el frontend apunta directamente al backend:

```
http://localhost:8080/api
```

Esto está configurado en `src/environments/environment.ts`. El backend debe estar corriendo antes de arrancar el frontend para que las llamadas a la API funcionen.

Para levantar el backend y la base de datos, usa el `docker-compose.yml` en la raíz del repositorio o consulta el `README.md` del backend.

En producción, la variable `apiUrl` usa una ruta relativa (`/api`), asumiendo que frontend y backend se sirven bajo el mismo dominio con un proxy/servidor web.

---

## Estructura del proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── interceptors/   # Interceptor HTTP global de errores
│   │   │   ├── models/         # Interfaces de dominio (Categoria, Producto, Page)
│   │   │   └── services/       # Servicios HTTP (CategoriaService, ProductoService)
│   │   ├── features/
│   │   │   ├── clientes/       # Vista y rutas de clientes
│   │   │   ├── dashboard/      # Pantalla de inicio
│   │   │   ├── ofertas/        # Vista y rutas de ofertas
│   │   │   ├── pedidos/        # Vista y rutas de pedidos
│   │   │   └── productos/      # Lista y formulario de productos
│   │   ├── layout/             # Shell: MainLayout, Sidebar, Topbar
│   │   └── shared/             # Módulo compartido
│   ├── environments/
│   │   ├── environment.ts      # Config desarrollo (apiUrl: localhost:8080)
│   │   └── environment.prod.ts # Config producción (apiUrl: /api)
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── public/
│   └── favicon.ico
├── angular.json
├── package.json
└── tsconfig.json
```

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo en `localhost:4200` |
| `npm run build` | Build de producción en `dist/` |
| `npm run watch` | Build de desarrollo en modo watch |
| `npm test` | Ejecuta tests con Vitest |

---

## Tecnologías

- Angular 21 (standalone/funcional)
- TypeScript 5.9
- RxJS 7.8
- Angular Router (lazy loading)
- Vitest (tests unitarios)
- Prettier (formato de código)
