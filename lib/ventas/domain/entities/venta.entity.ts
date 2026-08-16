// lib/ventas/domain/entities/venta.entity.ts

/**
 * Entidad de Dominio: Venta
 * Define los datos y reglas de negocio puras para una Venta.
 */
export interface Venta {
  id?: string
  clienteId: string
  total: number
  estado: 'pendiente' | 'completada' | 'cancelada'
  fechaCreacion?: Date
  items: VentaItem[]
}

export interface VentaItem {
  id?: string
  productoId: string
  cantidad: number
  precioUnitario: number
}
