// lib/inventario/application/use-cases/actualizar-stock.use-case.ts

import { ProductoRepository } from '@/inventario/domain/ports/producto-repository.port'

/**
 * Caso de Uso: ActualizarStockUseCase
 * Ejecuta la lógica para incrementar o disminuir el inventario físico de un producto.
 */
export class ActualizarStockUseCase {
  constructor(private readonly productoRepository: ProductoRepository) {}

  async execute(productoId: string, cantidadMovimiento: number): Promise<void> {
    const producto = await this.productoRepository.obtenerPorId(productoId)
    if (!producto) {
      throw new Error(`El producto con ID ${productoId} no existe.`)
    }

    const nuevoStock = producto.stock + cantidadMovimiento

    // Regla de negocio: El stock final no puede ser menor a cero
    if (nuevoStock < 0) {
      throw new Error(
        `Stock insuficiente para el producto "${producto.nombre}". Stock actual: ${producto.stock}`
      )
    }

    await this.productoRepository.actualizarStock(productoId, nuevoStock)
  }
}
