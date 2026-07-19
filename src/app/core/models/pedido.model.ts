export type EstadoPedido =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN_PREPARACION'
  | 'ENVIADO'
  | 'ENTREGADO'
  | 'CANCELADO';

export const ESTADOS_PEDIDO: EstadoPedido[] = [
  'PENDIENTE',
  'CONFIRMADO',
  'EN_PREPARACION',
  'ENVIADO',
  'ENTREGADO',
  'CANCELADO',
];

/** Etiquetas legibles para el enum de estado */
export const ESTADO_LABEL: Record<EstadoPedido, string> = {
  PENDIENTE:       'Pendiente',
  CONFIRMADO:      'Confirmado',
  EN_PREPARACION:  'En preparación',
  ENVIADO:         'Enviado',
  ENTREGADO:       'Entregado',
  CANCELADO:       'Cancelado',
};

export interface PedidoItemResponse {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnit: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  clienteNombre: string;
  estado: EstadoPedido;
  total: number;
  notas?: string;
  items: PedidoItemResponse[];
  createdAt?: string;
  updatedAt?: string;
}

// --- Requests ---

export interface PedidoItemRequest {
  productoId: number;
  cantidad: number;
}

export interface PedidoCreateRequest {
  clienteId: number;
  notas?: string;
  items: PedidoItemRequest[];
}

export interface PedidoCambiarEstadoRequest {
  estado: EstadoPedido;
}
