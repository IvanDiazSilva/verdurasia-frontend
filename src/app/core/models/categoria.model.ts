export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface CategoriaCreateRequest {
  nombre: string;
  descripcion?: string;
}

export interface CategoriaUpdateRequest {
  nombre?: string;
  descripcion?: string;
}
