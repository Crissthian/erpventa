import { ItemTabla } from '@/configuracion/domain/entities/tabla.entity'
import { TablaRepository } from '@/configuracion/domain/ports/tabla-repository.port'

export class ObtenerItemsTablaUseCase {
  constructor(private readonly tablaRepository: TablaRepository) {}

  async execute(codigoTabla: string): Promise<ItemTabla[]> {
    return this.tablaRepository.obtenerItemsPorCodigo(codigoTabla)
  }
}
