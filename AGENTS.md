# AGENTS.md — VerdurasIA Frontend

## Proyecto
VerdurasIA frontend es la interfaz web de una aplicación para gestionar productos, categorías, clientes, pedidos y ofertas de una verdulería, con foco en utilidad real, simplicidad y escalabilidad.

## Estado actual
- El proyecto está en Fase 3.
- La Fase 2 está cerrada.
- El foco actual es calidad, validación y refinamiento.
- Ya se han hecho refactors visuales pequeños en frontend con ramas separadas y PRs pequeñas.

## Objetivo actual
Trabajar por fases pequeñas, con cambios seguros, fáciles de revisar y sin mezclar deuda técnica distinta en la misma rama.

## Reglas de trabajo
- Una rama = una sola deuda o patrón compartido.
- Un PR = un alcance pequeño y revisable.
- No rediseñar salvo petición explícita.
- No tocar lógica, templates, rutas, servicios ni auth salvo petición explícita.
- Si un selector no es realmente idéntico, no moverlo a global.
- Preferir una extracción parcial buena antes que una unificación agresiva.

## Convenciones para cambios de estilos
- Confirmar primero el estado real de los componentes afectados.
- Verificar si los selectores son byte-for-byte idénticos antes de centralizarlos.
- Si son idénticos, moverlos a `src/styles.scss`.
- Si no son idénticos, dejarlos inline y explicar por qué.
- Siempre documentar:
  - archivos modificados,
  - alcance real,
  - selectores movidos,
  - qué se deja inline y por qué,
  - mensaje de commit recomendado.

## Flujo recomendado
1. Revisar `docs/working-log.md` antes de empezar.
2. Confirmar fase actual y siguiente microtarea.
3. Crear una rama pequeña desde `main`.
4. Hacer cambios mínimos.
5. Validar alcance.
6. Preparar PR clara y pequeña.
7. Actualizar `docs/working-log.md` al cerrar la sesión.

## Qué evitar
- No mezclar varios refactors en la misma rama.
- No tocar backend desde este repo.
- No hacer limpiezas masivas si no están acotadas.
- No asumir que dos estilos “parecidos” son iguales sin comprobarlo.

## Referencias internas
- `docs/working-log.md` = estado de trabajo y continuidad entre sesiones.
- `src/styles.scss` = punto de centralización global de estilos compartidos.