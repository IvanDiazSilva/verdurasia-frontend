export type TipoOferta = 'PORCENTAJE' | 'MONTO_FIJO';

export const TIPO_OFERTA_LABEL: Record<TipoOferta, string> = {
  PORCENTAJE: '% Porcentaje',
  MONTO_FIJO: '€ Monto fijo',
};

export interface Oferta {
  id: number;
  nombre: string;
  descripcion?: string;
  descuento: number;
  tipo: TipoOferta;
  fechaInicio: string; // ISO date: 'YYYY-MM-DD'
  fechaFin: string;    // ISO date: 'YYYY-MM-DD'
  activa: boolean;
  productoId?: number;
  productoNombre?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OfertaCreateRequest {
  nombre: string;
  descripcion?: string;
  descuento: number;
  tipo: TipoOferta;
  fechaInicio: string;
  fechaFin: string;
  productoId?: number | null;
}

export interface OfertaUpdateRequest {
  nombre?: string;
  descripcion?: string;
  descuento?: number;
  tipo?: TipoOferta;
  fechaInicio?: string;
  fechaFin?: string;
  activa?: boolean;
  productoId?: number | null;
}
