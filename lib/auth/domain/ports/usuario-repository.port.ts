import { Usuario } from '@/auth/domain/entities/usuario.entity'

export interface UsuarioRepository {
  obtenerPorUsername(username: string): Promise<Usuario | null>
  listarTodos(): Promise<Usuario[]>
  guardar(usuario: Usuario): Promise<void>
}
