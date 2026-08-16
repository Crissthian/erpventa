import { OpcionUsuarioRepository } from '@/configuracion/domain/ports/opcion-usuario-repository.port'

export class ObtenerModulosPermitidosUseCase {
  constructor(private readonly opcionUsuarioRepository: OpcionUsuarioRepository) {}

  async execute(codigoUsuario: string): Promise<string[]> {
    return this.opcionUsuarioRepository.obtenerModulosPermitidos(codigoUsuario)
  }
}