import { TablaRepository } from '@/configuracion/domain/ports/tabla-repository.port'

export class ActualizarItemTablaUseCase {
  constructor(private readonly tablaRepository: TablaRepository) {}

  async execute(codigoTabla: string, numeroItem: string, descripcionItem: string): Promise<void> {
    return this.tablaRepository.actualizarItem(codigoTabla, numeroItem, descripcionItem)
  }
}
