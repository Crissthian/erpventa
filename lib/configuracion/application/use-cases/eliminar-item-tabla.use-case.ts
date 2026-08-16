import { TablaRepository } from '@/configuracion/domain/ports/tabla-repository.port'

export class EliminarItemTablaUseCase {
  constructor(private readonly tablaRepository: TablaRepository) {}

  async execute(codigoTabla: string, numeroItem: string): Promise<void> {
    return this.tablaRepository.eliminarItem(codigoTabla, numeroItem)
  }
}
