import { TablaRepository } from '@/configuracion/domain/ports/tabla-repository.port'

export class CrearItemTablaUseCase {
  constructor(private readonly tablaRepository: TablaRepository) {}

  async execute(codigoTabla: string, numeroItem: string, descripcionItem: string): Promise<void> {
    return this.tablaRepository.crearItem(codigoTabla, numeroItem, descripcionItem)
  }
}
