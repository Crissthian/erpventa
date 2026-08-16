import { Usuario } from '@/auth/domain/entities/usuario.entity'
import { UsuarioRepository } from '@/auth/domain/ports/usuario-repository.port'
import { encrypt } from '@/auth/legacy-crypto'

export type ResultadoAutenticacion =
  | { ok: true; usuario: Usuario }
  | { ok: false; razon: 'credenciales' | 'bloqueado' }

export class AutenticarUsuarioUseCase {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async execute(username: string, password: string): Promise<ResultadoAutenticacion> {
    const usuario = await this.usuarioRepository.obtenerPorUsername(username)
    if (!usuario) return { ok: false, razon: 'credenciales' }

    const passwordCifrada = encrypt(password)
    if (passwordCifrada !== usuario.password) return { ok: false, razon: 'credenciales' }

    if (!usuario.activo) return { ok: false, razon: 'bloqueado' }

    return { ok: true, usuario }
  }
}
