import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pedido, EstadoPedido } from '../models/pedido.model';

/**
 * Estados posibles de un pedido y sus transiciones válidas.
 *
 * Secuencia esperada: PENDIENTE → CONFIRMADO → EN_PREPARACIÓN → ENVIADO → ENTREGADO
 *
 * Invalid transitions:
 * - ENTREGADO a cualquier estado anterior (pedido finalizado)
 * - Saltarse estados intermedios sin validación backend
 */
export const PEDIDO_ESTADOS: EstadoPedido[] = [
  'PENDIENTE',
  'CONFIRMADO',
  'EN_PREPARACION',
  'ENVIADO',
  'ENTREGADO',
];

export type PedidoEstado = typeof PEDIDO_ESTADOS[number];

/**
 * Transiciones válidas de estado.
 */
const TRANSITIONS = {
  PENDIENTE: ['CONFIRMADO'],
  CONFIRMADO: ['EN_PREPARACION'],
  EN_PREPARACION: ['ENVIADO'],
  ENVIADO: ['ENTREGADO'],
  ENTREGADO: [],
};

/**
 * Obtiene la siguiente estado permitido desde el actual
 */
export function obtenerSiguienteEstado(estadoActual: PedidoEstado): PedidoEstado | null {
  const siguientes = TRANSITIONS[estadoActual];
  return siguientes && siguientes.length > 0 ? siguientes[0] : null;
}

/**
 * Verifica si una transición de estado es válida
 */
export function esCambioValido(estadoActual: PedidoEstado, nuevoEstado: PedidoEstado): { valido: boolean; motivo?: string } {
  // Un pedido entregado no puede cambiar de estado
  if (estadoActual === 'ENTREGADO') {
    return { valido: false, motivo: 'No se pueden cambiar estados de un pedido entregado' };
  }

  // Verificar si la transición está en la lista de permitidas
  const permitidas = TRANSITIONS[estadoActual] || [];
  const esPermitido = permitidas.includes(nuevoEstado);

  if (esPermitido) {
    return { valido: true };
  }

  // Verificar si es un retorno a estado anterior (solo ENTREGADO no debería volver)
  if (estadoActual !== 'ENTREGADO' && nuevoEstado === 'PENDIENTE') {
    return { valido: false, motivo: 'No se pueden retroceder a PENDIENTE' };
  }

  return { valido: false, motivo: 'Transición de estado no permitida' };
}

/**
 * Obtiene la etiqueta para mostrar en la UI (mismo formato que el modelo)
 */
export function obtenerEtiquetaEstado(estado: PedidoEstado): string {
  const labels: Record<PedidoEstado, string> = {
    PENDIENTE: 'Pendiente',
    CONFIRMADO: 'Confirmado',
    EN_PREPARACION: 'En preparaciÃ³n',
    ENVIADO: 'Enviado',
    ENTREGADO: 'Entregado',
  };
  return labels[estado] || estado;
}

/**
 * Servicio unificado para la lógica de cambio de estado de pedidos.
 *
 * Centraliza:
 * - Validaciones de transiciones de estado
 * - Constantes de estados y etiquetas
 * - Lógica de qué cambios son permitidos
 *
 * Los componentes y servicios deben usar este servicio en lugar de
 * manejar la lógica de estado directamente.
 *
 * El servicio HTTP real (PATCH a /api/pedidos/:id/estado) sigue estando
 * en PedidoService, pero la validación y decisión de si cambiar
 * el estado debe pasar por aquí primero.
 */
@Injectable({ providedIn: 'root' })
export class PedidoStateService {
  /**
   * Cambia el estado de un pedido si la transición es válida.
   *
   * @param pedidoId ID del pedido
   * @param nuevoEstado Nuevo estado al que cambiar
   * @returns Observable con el resultado de la operación
   */
  cambiarEstado(pedidoId: number, nuevoEstado: EstadoPedido): Observable<{ valido: boolean; mensaje?: string }> {
    // Validation is synchronous - wrap in of()
    const resultado = this.validarCambio(pedidoId, nuevoEstado);
    return of(resultado);
  }

  /**
   * Valida si un cambio de estado es permitido.
   */
  validarCambio(estadoActual: EstadoPedido, nuevoEstado: EstadoPedido): { valido: boolean; mensaje?: string } {
    // Un pedido entregado no puede cambiar de estado
    if (estadoActual === 'ENTREGADO') {
      return { valido: false, motivo: 'No se pueden cambiar estados de un pedido entregado' };
    }

    // Verificar si la transición está permitida
    const permitidas = TRANSITIONS[estadoActual] || [];
    if (permitidas.includes(nuevoEstado)) {
      return { valido: true };
    }

    // Verificar si es un retorno no permitido
    if (nuevoEstado === 'PENDIENTE') {
      return { valido: false, motivo: 'No se pueden retroceder a PENDIENTE' };
    }

    return { valido: false, motivo: 'Transición de estado no permitida' };
  }

  /**
   * Obtiene la etiqueta para mostrar en la UI
   */
  obtenerEtiqueta(estado: EstadoPedido): string {
    return obtenerEtiquetaEstado(estado);
  }

  /**
   * Obtiene el siguiente estado en la secuencia
   */
  siguienteEstado(estadoActual: EstadoPedido): PedidoEstado | null {
    return obtenerSiguienteEstado(estadoActual);
  }

  /**
   * Verifica si el pedido ya está en un estado final (ENTREGADO)
   */
  estaEnEstadoFinal(estado: EstadoPedido): boolean {
    return estado === 'ENTREGADO';
  }
}