import { SelectOption } from '@/ventas/domain/entities/select-option.entity'
import { SelectOptionsRepository } from '@/ventas/domain/ports/select-options-repository.port'

export class ObtenerMonedasUseCase {
  constructor(private readonly repository: SelectOptionsRepository) {}

  async execute(): Promise<SelectOption[]> {
    return this.repository.obtenerMonedas()
  }
}
