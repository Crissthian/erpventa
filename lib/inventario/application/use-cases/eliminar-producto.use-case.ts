import { ProductoRepository } from '@/inventario/domain/ports/producto-repository.port'

export class EliminarProductoUseCase {
  constructor(private readonly repository: ProductoRepository) {}

  async execute(codigo: string): Promise<void> {
    if (!codigo || codigo.trim() === '') {
      throw new Error('El código del producto a eliminar no puede estar vacío.')
    }
    const existe = await this.repository.obtenerPorCodigo(codigo)
    if (!existe) {
      throw new Error(`El producto con código '${codigo}' no existe.`)
    }
    await this.repository.eliminar(codigo)
  }
}
