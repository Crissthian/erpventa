import { ProductoRepository, ProductoRow } from '@/inventario/domain/ports/producto-repository.port'

export class ListarProductosConLineaUseCase {
  constructor(private readonly repository: ProductoRepository) {}

  async execute(): Promise<ProductoRow[]> {
    return this.repository.listarConLinea()
  }
}
