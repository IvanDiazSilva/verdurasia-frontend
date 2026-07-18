export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  unidad: string;
  activo: boolean;
  categoriaId?: number;
  categoriaNombre?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductoCreateRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  unidad: string;
  categoriaId?: number | null;
}
