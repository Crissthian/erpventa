import { redirect } from 'next/navigation'

import { ObtenerModulosPermitidosUseCase } from '@/configuracion/application/use-cases/obtener-modulos-permitidos.use-case'
import { SqlOpcionUsuarioRepository } from '@/configuracion/infrastructure/adapters/sql-opcion-usuario.repository'
import { getSession } from './session'

/**
 * Devuelve los códigos de módulo (CDG_OPC) a los que el usuario de la sesión
 * tiene acceso activo. Si no hay sesión, retorna una lista vacía.
 */
export async function obtenerModulosPermitidos(): Promise<string[]> {
  const session = await getSession()
  if (!session) return []

  const repository = new SqlOpcionUsuarioRepository()
  const useCase = new ObtenerModulosPermitidosUseCase(repository)
  return useCase.execute(session.userId)
}

/**
 * Bloquea el acceso a un módulo redirigiendo al home si el usuario no posee
 * el permiso (CDG_OPC) o no hay sesión activa.
 */
export async function requireModuloAcceso(codigoOpc: string): Promise<void> {
  const session = await getSession()
  if (!session) redirect('/')

  const modulos = await obtenerModulosPermitidos()
  if (!modulos.includes(codigoOpc)) redirect('/')
}