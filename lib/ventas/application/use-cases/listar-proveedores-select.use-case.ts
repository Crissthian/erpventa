import { ProveedorSelectItem } from '@/ventas/domain/entities/proveedor.entity'
import { ProveedorRepository } from '@/ventas/domain/ports/proveedor-repository.port'

export class ListarProveedoresSelectUseCase {
  constructor(private readonly repository: ProveedorRepository) {}

  async execute(): Promise<ProveedorSelectItem[]> {
    return this.repository.listarParaSelect()
  }
}
