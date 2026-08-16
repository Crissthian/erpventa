import { OpcionesSistema } from '@/configuracion/domain/entities/opciones-sistema.entity'
import { OpcionesSistemaRepository } from '@/configuracion/domain/ports/opciones-sistema-repository.port'

export class GuardarOpcionesSistemaUseCase {
  constructor(private readonly repository: OpcionesSistemaRepository) {}

  async execute(opciones: OpcionesSistema): Promise<void> {
    return this.repository.guardar(opciones)
  }
}
