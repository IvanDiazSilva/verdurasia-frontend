import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

export type AppLanguage = 'es' | 'en';

const dictionaries = {
  es: {
    TOPBAR: {
      title: 'VerdurasIA',
    },
    NAV: {
      dashboard: 'Dashboard',
      productos: 'Productos',
      clientes: 'Clientes',
      pedidos: 'Pedidos',
      ofertas: 'Ofertas',
      categorias: 'Categorías',
    },
    DASHBOARD: {
      title: 'Dashboard',
    },
    PRODUCTOS: {
      list: 'Productos',
      nuevo: 'Nuevo producto',
      nombre: 'Nombre',
      descripcion: 'Descripción',
      precio: 'Precio (S/)',
      unidad: 'Unidad',
      stock: 'Stock inicial',
      categoria: 'Categoría',
      guardar: 'Guardar producto',
      guardar_cambios: 'Guardar cambios',
      cancelar: 'Cancelar',
      eliminar: 'Eliminar',
      confirm_eliminar: '¿Eliminar ',
      placeholder_nombre: 'Ej: Tomates cherry',
      placeholder_descripcion: 'Descripción opcional del producto',
      placeholder_precio: '0.00',
      placeholder_stock: '0',
      campo_requerido: 'Campo obligatorio',
      minlength_nombre: 'El nombre debe tener al menos 2 caracteres.',
      maxlength_nombre: 'El nombre no puede superar los 150 caracteres.',
      min_precio: 'El precio no puede ser negativo.',
    },
    CLIENTES: {
      list: 'Clientes',
      nuevo: 'Nuevo cliente',
      nombre: 'Nombre',
      email: 'Email',
      telefono: 'Teléfono',
      direccion: 'Dirección',
      activo: 'Estado',
      crear: 'Crear cliente',
      guardar_cambios: 'Guardar cambios',
      cancelar: 'Cancelar',
      eliminar: 'Eliminar',
      confirm_eliminar: '¿Eliminar al cliente ',
      placeholder_nombre: 'Ej: María García',
      placeholder_email: 'maria@ejemplo.com',
      placeholder_telefono: 'Ej: 612 345 678',
      placeholder_direccion: 'Dirección de entrega (opcional)',
    },
    PEDIDOS: {
      list: 'Pedidos',
      nuevo: 'Nuevo pedido',
      cliente: 'Cliente',
      ver_detalle: 'Ver detalle',
      estados: {
        PENDIENTE: 'Pendiente',
        CONFIRMADO: 'Confirmado',
        EN_PREPARACION: 'En preparación',
        ENVIADO: 'Enviado',
        ENTREGADO: 'Entregado',
        CANCELADO: 'Cancelado',
      },
      crear: 'Crear pedido',
      cancelar: 'Cancelar',
      eliminar: 'Eliminar',
      confirm_eliminar: '¿Eliminar el pedido # ',
      total: 'Total',
      articulo: 'Artículo',
      fecha: 'Fecha',
      cambiar_estado: 'Cambiar estado',
      confirm_cambio_estado: '¿Cambiar estado a ',
    },
    OFERTAS: {
      list: 'Ofertas',
      nueva: 'Nueva oferta',
      nombre: 'Nombre',
      descripcion: 'Descripción',
      tipo: 'Tipo de descuento',
      PORCENTAJE: '% Porcentaje',
      MONTO_FIJO: 'S/ Monto fijo',
      descuento: 'Descuento',
      fecha_inicio: 'Fecha inicio',
      fecha_fin: 'Fecha fin',
      producto: 'Producto asociado',
      sin_producto: 'Sin producto (oferta global)',
      activa: 'Activa',
      inactiva: 'Inactiva',
      crear: 'Crear oferta',
      guardar_cambios: 'Guardar cambios',
      cancelar: 'Cancelar',
      eliminar: 'Eliminar',
      confirm_eliminar: '¿Eliminar la oferta ',
    },
    COMMON: {
      selecciona: 'Selecciona',
      buscar: 'Buscar',
      filtrar: 'Filtrar',
      no_hay_registros: 'No hay registros.',
      no_hay_registros_busqueda: 'No hay clientes que coincidan con la búsqueda.',
    },
  },
  en: {
    TOPBAR: {
      title: 'VerdurasIA',
    },
    NAV: {
      dashboard: 'Dashboard',
      productos: 'Products',
      clientes: 'Clients',
      pedidos: 'Orders',
      ofertas: 'Offers',
      categorias: 'Categories',
    },
    DASHBOARD: {
      title: 'Dashboard',
    },
    PRODUCTOS: {
      list: 'Products',
      nuevo: 'New product',
      nombre: 'Name',
      descripcion: 'Description',
      precio: 'Price (S/)',
      unidad: 'Unit',
      stock: 'Initial stock',
      categoria: 'Category',
      guardar: 'Save product',
      guardar_cambios: 'Save changes',
      cancelar: 'Cancel',
      eliminar: 'Delete',
      confirm_eliminar: 'Delete ',
      placeholder_nombre: 'Eg: Cherry tomatoes',
      placeholder_descripcion: 'Optional product description',
      placeholder_precio: '0.00',
      placeholder_stock: '0',
      campo_requerido: 'Required field',
      minlength_nombre: 'Name must be at least 2 characters.',
      maxlength_nombre: 'Name must not exceed 150 characters.',
      min_precio: 'Price cannot be negative.',
    },
    CLIENTES: {
      list: 'Clients',
      nuevo: 'New client',
      nombre: 'Name',
      email: 'Email',
      telefono: 'Phone',
      direccion: 'Address',
      activo: 'Status',
      crear: 'Create client',
      guardar_cambios: 'Save changes',
      cancelar: 'Cancel',
      eliminar: 'Delete',
      confirm_eliminar: 'Delete client ',
      placeholder_nombre: 'Eg: Maria Garcia',
      placeholder_email: 'maria@example.com',
      placeholder_telefono: 'Eg: 612 345 678',
      placeholder_direccion: 'Delivery address (optional)',
    },
    PEDIDOS: {
      list: 'Orders',
      nuevo: 'New order',
      cliente: 'Client',
      ver_detalle: 'View detail',
      estados: {
        PENDIENTE: 'Pending',
        CONFIRMADO: 'Confirmed',
        EN_PREPARACION: 'In preparation',
        ENVIADO: 'Sent',
        ENTREGADO: 'Delivered',
        CANCELADO: 'Cancelled',
      },
      crear: 'Create order',
      cancelar: 'Cancel',
      eliminar: 'Delete',
      confirm_eliminar: 'Delete order # ',
      total: 'Total',
      articulo: 'Item',
      fecha: 'Date',
      cambiar_estado: 'Change status',
      confirm_cambio_estado: 'Change status to ',
    },
    OFERTAS: {
      list: 'Offers',
      nueva: 'New offer',
      nombre: 'Name',
      descripcion: 'Description',
      tipo: 'Discount type',
      PORCENTAJE: '% Percentage',
      MONTO_FIJO: 'S/ Fixed amount',
      descuento: 'Discount',
      fecha_inicio: 'Start date',
      fecha_fin: 'End date',
      producto: 'Associated product',
      sin_producto: 'No product (global offer)',
      activa: 'Active',
      inactiva: 'Inactive',
      crear: 'Create offer',
      guardar_cambios: 'Save changes',
      cancelar: 'Cancel',
      eliminar: 'Delete',
      confirm_eliminar: 'Delete offer ',
    },
    COMMON: {
      selecciona: 'Select',
      buscar: 'Search',
      filtrar: 'Filter',
      no_hay_registros: 'No items.',
      no_hay_registros_busqueda: 'No clients match the search.',
    },
  },
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly currentLanguage = signal<'es' | 'en'>('es');

  constructor() {
    const saved = this.getSavedLanguage();
    if (saved) {
      this.currentLanguage.set(saved);
    }
  }

  getSavedLanguage(): 'es' | 'en' | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      const item = localStorage.getItem('verdurasia.language');
      if (!item) return null;
      const lang = item as 'es' | 'en';
      return lang === 'es' || lang === 'en' ? lang : null;
    } catch {
      return null;
    }
  }

  setLanguage(language: AppLanguage): void {
    this.currentLanguage.set(language);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('verdurasia.language', language);
      }
    } catch {
      // localStorage not available, ignore
    }
  }

  translate(key: string): string {
    const dict = dictionaries[this.currentLanguage()];
    const keys = key.split('.');
    let value: any = dict;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = null;
        break;
      }
    }

    if (typeof value === 'string' && value.length > 0) {
      return value;
    }

    // Fallback to Spanish if the key is missing in the current language
    const spanishDict = dictionaries['es'];
    let spanishValue: any = spanishDict;

    for (const k of keys) {
      if (spanishValue && typeof spanishValue === 'object' && k in spanishValue) {
        spanishValue = spanishValue[k];
      } else {
        spanishValue = null;
        break;
      }
    }

    if (typeof spanishValue === 'string' && spanishValue.length > 0) {
      return spanishValue;
    }

    // Last resort: return the key in uppercase
    return key.toUpperCase();
  }
}