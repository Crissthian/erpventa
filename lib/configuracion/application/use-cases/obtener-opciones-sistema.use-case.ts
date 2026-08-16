import { OpcionesSistema } from '@/configuracion/domain/entities/opciones-sistema.entity'
import { OpcionesSistemaRepository } from '@/configuracion/domain/ports/opciones-sistema-repository.port'

export class ObtenerOpcionesSistemaUseCase {
  constructor(private readonly repository: OpcionesSistemaRepository) {}

  async execute(): Promise<OpcionesSistema | null> {
    return this.repository.obtener()
  }
}
