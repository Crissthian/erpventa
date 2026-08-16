import { Usuario } from '@/auth/domain/entities/usuario.entity'
import { UsuarioRepository } from '@/auth/domain/ports/usuario-repository.port'

export class ListarUsuariosUseCase {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async execute(): Promise<Usuario[]> {
    return this.usuarioRepository.listarTodos()
  }
}