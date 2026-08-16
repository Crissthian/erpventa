import { z } from 'zod/v4'

export const asignacionOpcionesSchema = z.object({
  codigoModulo: z.string().min(1, 'Seleccione un módulo'),
  numeroItem: z.string().min(1, 'Seleccione una opción'),
  estado: z.string().min(1, 'Seleccione un estado')
})

export type AsignacionOpcionesInput = z.input<typeof asignacionOpcionesSchema>

export const guardarOpcionUsuarioSchema = z.object({
  codigoUsuario: z.string().min(1, 'Seleccione un usuario').max(10, 'Máximo 10 caracteres'),
  codigoOpcion: z.string().min(1, 'Módulo inválido').max(3, 'Módulo inválido'),
  numeroItem: z.string().min(1, 'Opción inválida').max(3, 'Opción inválida'),
  estado: z.enum(['0', '1'], { message: 'Estado inválido' })
})

export type GuardarOpcionUsuarioInput = z.input<typeof guardarOpcionUsuarioSchema>

export const eliminarOpcionUsuarioSchema = z.object({
  codigoUsuario: z.string().min(1, 'Usuario requerido').max(10, 'Máximo 10 caracteres'),
  codigoOpcion: z.string().min(1, 'Módulo inválido').max(3, 'Módulo inválido'),
  numeroItem: z.string().min(1, 'Opción inválida').max(3, 'Opción inválida')
})

export type EliminarOpcionUsuarioInput = z.input<typeof eliminarOpcionUsuarioSchema>