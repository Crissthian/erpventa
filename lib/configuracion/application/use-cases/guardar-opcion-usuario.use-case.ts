import { OpcionUsuario } from '@/configuracion/domain/entities/opcion-usuario.entity'
import { OpcionUsuarioRepository } from '@/configuracion/domain/ports/opcion-usuario-repository.port'

export class GuardarOpcionUsuarioUseCase {
  constructor(private readonly opcionUsuarioRepository: OpcionUsuarioRepository) {}

  async execute(opcion: OpcionUsuario): Promise<void> {
    return this.opcionUsuarioRepository.guardar(opcion)
  }
}