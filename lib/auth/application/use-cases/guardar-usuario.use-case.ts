import { Usuario } from '@/auth/domain/entities/usuario.entity'
import { UsuarioRepository } from '@/auth/domain/ports/usuario-repository.port'

export class GuardarUsuarioUseCase {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async execute(usuario: Usuario): Promise<void> {
    return this.usuarioRepository.guardar(usuario)
  }
}
