import { Tabla } from '@/configuracion/domain/entities/tabla.entity'
import { TablaRepository } from '@/configuracion/domain/ports/tabla-repository.port'

export class ObtenerTablasUseCase {
  constructor(private readonly tablaRepository: TablaRepository) {}

  async execute(): Promise<Tabla[]> {
    return this.tablaRepository.obtenerTodas()
  }
}
