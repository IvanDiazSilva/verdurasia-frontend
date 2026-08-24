# VerdurasIA v0 - Versión Inicial para Cliente

## Acerca de Esta Versión
VerdurasIA v0 es la primera versión de la aplicación de gestión para la verdulería, enfocada en funcionalidades críticas para la operación diaria. Esta versión incluye las características principales implementadas en la Fase 3 con calidad garantizada mediante tests unitarios.

## Cómo Acceder

### Desarrollo Local
1. Ejecutar `ng serve` en el directorio del frontend
2. Abrir `http://localhost:4200` en el navegador
3. El application recargará automáticamente al hacer cambios

### Build de Producción
1. Ejecutar `ng build --configuration production`
2. El build se genera en la carpeta `dist/verdurasia-frontend/`
3. Desplegar los archivos de la carpeta `dist` en el servidor

## Credenciales de Prueba

### Acceso al Sistema
- **Usuario administrador:** credentials to be defined (configurar en Keycloak)
- **Usuario cliente estándar:** credentials to be defined (configurar en Keycloak)

> Nota: Las credenciales dependen de la configuración de Keycloak en el backend. 
> Para credenciales de test, consultar con el equipo de backend.

## Qué Probar en v0

### 1. Dashboard
- [ ] Ver las 7 tarjetas de métricas:
  - Pedidos pendientes (⏳, color rojo `#b91c1c`)
  - Productos (🥦, color `#2d6a4f`)
  - Clientes (👤, color `#1e40af`)
  - Pedidos (📦, color `#92400e`)
  - Ofertas vigentes (🏷️, color `#5b21b6`)
  - **Pedidos hoy** (📅, color `#2d3748`) - *nueva en MT-10*
  - **Importe hoy** (💰, color `#2d3748`) - *nueva en MT-10*
  - **Productos top** (📈, color `#2d3748`) - *nueva en MT-10*
- [ ] Verificar que los datos se muestran (aunque sean 0 si no hay datos)

### 2. Lista de Pedidos
- [ ] Acceder a la sección de Pedidos
- [ ] Filtrar por estado usando el selector "Todos los estados"
- [ ] Ver lista de pedidos con sus datos (id, cliente, estado, total, fecha)
- [ ] Identificar pedidos PENDIENTE por su fondo naranja `#fff7ed`
- [ ] Ver feedback visual al cambiar estado (animación de pulso "Guardando...")

### 3. Crear Pedido
- [ ] Ir a "Nuevo pedido" (solo admin)
- [ ] Seleccionar un cliente del selector
- [ ] Agregar al menos una línea de producto
- [ ] Ingresar cantidad mínima 1
- [ ] Hacer clic en "Crear pedido"
- [ ] Verificar que el pedido se crea y regresa a la lista

### 4. Cambiar Estado de Pedido (Solo Admin)
- [ ] Tener rol de admin
- [ ] Hacer clic en el badge de estado de un pedido PENDIENTE
- [ ] Seleccionar un nuevo estado en el select
- [ ] Verificar que aparece "Guardando..." con animación de pulso
- [ ] Esperar a que la lista se recargue con el nuevo estado
- [ ] Probar el error: desconectar backend y cambiar un estado → mensaje de error en rojo bajo el badge

## Qué Reportar como Feedback

### Formato de Reporte
```
Componente: [Dashboard|Pedidos|Pedido|...]
Pasos: [descripción paso a paso]
Expected: [qué esperaba que pasaba]
Actual: [qué pasó de verdad]
Pantalla: [URL o descripción]
```

### Qué Específico Informar
- Pantalla exacta donde falló
- Pasos exactos para reproducir
- Mensajes de error en consola (F12)
- Navegador y versión usados
- Si es consistente o intermitente

### Canales de Reporte
- Issue tracker: [URL del repositorio GitHub]
- Correo electrónico: [email del equipo]
- Canal de comunicación del proyecto

## Próximas Mejoraciones (v1)

### Funcionalidades para agregar:
- [ ] Búsqueda avanzada de productos en el pedido
- [ ] Exportar pedidos a CSV/Excel
- [ ] Filtrar por rango de fechas en el dashboard
- [ ] Más estadísticas en el dashboard

### Mejoras de UI/UX:
- [ ] Toolbar más intuitiva
- [ ] Mensajes de error más descriptivos
- [ ] Estados de carga más claros
- [ ] Mejorar responsividad en móviles

---

**Fecha de entrega:** [Fecha de liberación v0]  
**Desarrollado por:** Equipo VerdurasIA  
**Versión:** v0.0.1  
**Soporte:** Equipo de desarrollo