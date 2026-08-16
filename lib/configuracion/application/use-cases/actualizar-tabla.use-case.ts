import { TablaRepository } from '@/configuracion/domain/ports/tabla-repository.port'

export class ActualizarTablaUseCase {
  constructor(private readonly tablaRepository: TablaRepository) {}

  async execute(codigo: string, descripcion: string): Promise<void> {
    return this.tablaRepository.actualizarTabla(codigo, descripcion)
  }
}
