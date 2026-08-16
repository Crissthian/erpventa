import { Producto } from '@/inventario/domain/entities/producto.entity'
import { ProductoRepository } from '@/inventario/domain/ports/producto-repository.port'

export class GuardarProductoUseCase {
  constructor(private readonly repository: ProductoRepository) {}

  async execute(producto: Producto): Promise<Producto> {
    if (!producto.codigo || producto.codigo.trim() === '') {
      throw new Error('El código de producto es obligatorio.')
    }
    if (!producto.descripcion || producto.descripcion.trim() === '') {
      throw new Error('La descripción de producto es obligatoria.')
    }

    const existe = await this.repository.obtenerPorCodigo(producto.codigo)
    if (existe) {
      return this.repository.actualizar(producto)
    } else {
      return this.repository.crear(producto)
    }
  }
}
