// lib/inventario/domain/entities/producto.entity.ts

/**
 * Entidad de Dominio: Producto
 * Define las reglas y estructura de los productos del inventario.
 */
export interface Producto {
  codigo: string
  linea: string
  activo: boolean
  cEquivalente?: string
  codBarra?: string
  abreviatura?: string
  descripcion: string
  nombre: string
  stock: number
  afecto: boolean
  volumen: number
  peso: number
  destVenta: boolean
  destCompra: boolean
  tipo?: string
  procedencia?: string
  subFamilia?: string
  undMedida?: string
  valorSoles: number
  valorDolares: number
  usuarioModificacion?: string
  fechaModificacion?: Date
  horaModificacion?: string
}

