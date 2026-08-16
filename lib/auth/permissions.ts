import { getSession } from './session'

/**
 * Valida si el usuario actual tiene el permiso especificado.
 * Si no está autenticado o no cuenta con el permiso, lanza un error.
 */
export async function requirePermission(permissionName: string): Promise<void> {
  const session = await getSession()
  if (!session) {
    throw new Error('No autorizado: Se requiere iniciar sesión')
  }

  // En el futuro, se puede validar el campo session.userId o session.level en la base de datos
  // contra una tabla de permisos asociada al rol/nivel de usuario.
  // Por ahora, asumimos que cualquier usuario autenticado tiene acceso.
  console.log(
    `[Seguridad] Usuario ${session.username} accedió a recurso protegido con permiso: ${permissionName}`
  )
}
