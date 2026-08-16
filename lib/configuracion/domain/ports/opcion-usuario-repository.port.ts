import { OpcionUsuario } from '@/configuracion/domain/entities/opcion-usuario.entity'

export interface OpcionUsuarioRepository {
  guardar(opcion: OpcionUsuario): Promise<void>
  obtenerModulosPermitidos(codigoUsuario: string): Promise<string[]>
}