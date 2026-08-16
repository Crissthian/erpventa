import { SelectOptionsRepository } from '@/ventas/domain/ports/select-options-repository.port'

export class ObtenerSiguienteCodigoProductoUseCase {
  constructor(private readonly repository: SelectOptionsRepository) {}

  async execute(abreviatura: string): Promise<string> {
    return this.repository.obtenerSiguienteCodigoProducto(abreviatura)
  }
}
