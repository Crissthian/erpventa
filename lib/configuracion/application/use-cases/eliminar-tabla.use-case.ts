import { TablaRepository } from '@/configuracion/domain/ports/tabla-repository.port'

export class EliminarTablaUseCase {
  constructor(private readonly tablaRepository: TablaRepository) {}

  async execute(codigo: string): Promise<void> {
    return this.tablaRepository.eliminarTabla(codigo)
  }
}
