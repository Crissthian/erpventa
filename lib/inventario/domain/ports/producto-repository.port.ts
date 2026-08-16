// lib/inventario/domain/ports/producto-repository.port.ts

import { Producto } from '@/inventario/domain/entities/producto.entity'

/**
 * Puerto de Salida: ProductoRepository
 * Contrato para operaciones de base de datos sobre la entidad Producto.
 */
export interface ProductoRow {
  codigo: string
  descripcion: string
  linea?: string
}

export interface ProductoRepository {
  crear(producto: Producto): Promise<Producto>
  actualizar(producto: Producto): Promise<Producto>
  eliminar(codigo: string): Promise<void>
  obtenerPorId(id: string): Promise<Producto | null>
  obtenerPorCodigo(codigo: string): Promise<Producto | null>
  actualizarStock(id: string, nuevoStock: number): Promise<void>
  listar(): Promise<Producto[]>
  listarConLinea(): Promise<ProductoRow[]>
}
