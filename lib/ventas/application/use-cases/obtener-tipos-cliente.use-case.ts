import { SelectOption } from '@/ventas/domain/entities/select-option.entity'
import { SelectOptionsRepository } from '@/ventas/domain/ports/select-options-repository.port'

export class ObtenerTiposClienteUseCase {
  constructor(private readonly selectOptionsRepository: SelectOptionsRepository) {}

  async execute(): Promise<SelectOption[]> {
    return this.selectOptionsRepository.obtenerTiposCliente()
  }
}
