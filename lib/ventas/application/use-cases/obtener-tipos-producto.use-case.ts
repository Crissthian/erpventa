import { SelectOption } from '@/ventas/domain/entities/select-option.entity'
import { SelectOptionsRepository } from '@/ventas/domain/ports/select-options-repository.port'

export class ObtenerTiposProductoUseCase {
  constructor(private readonly repository: SelectOptionsRepository) {}

  async execute(): Promise<SelectOption[]> {
    return this.repository.obtenerTiposProducto()
  }
}
