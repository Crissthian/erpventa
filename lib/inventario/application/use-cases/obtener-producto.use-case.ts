import { Producto } from '@/inventario/domain/entities/producto.entity'
import { ProductoRepository } from '@/inventario/domain/ports/producto-repository.port'

export class ObtenerProductoPorCodigoUseCase {
  constructor(private readonly repository: ProductoRepository) {}

  async execute(codigo: string): Promise<Producto | null> {
    if (!codigo || codigo.trim() === '') {
      throw new Error('El código del producto no puede estar vacío.')
    }
    return this.repository.obtenerPorCodigo(codigo)
  }
}
