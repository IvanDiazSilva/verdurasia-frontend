export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClienteCreateRequest {
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

export interface ClienteUpdateRequest {
  nombre?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo?: boolean;
}
