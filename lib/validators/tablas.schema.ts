import { z } from 'zod/v4'

export const tablaSchema = z.object({
  codigo: z
    .string()
    .length(3, 'Código de tabla debe ser exactamente 3 caracteres')
    .regex(/^[A-Za-z0-9]+$/, 'Código solo permite letras y números'),
  descripcion: z.string().min(1, 'Nombre requerido').max(30, 'Máximo 30 caracteres')
})

export const itemTablaSchema = z.object({
  codigoTabla: z.string().length(3, 'Código de tabla debe ser 3 caracteres'),
  numeroItem: z.string().length(3, 'Número de item debe ser 3 caracteres'),
  descripcionItem: z.string().min(1, 'Descripción requerida').max(250, 'Máximo 250 caracteres')
})

export const limpiezaTablasSchema = z.object({
  ids: z
    .array(z.string())
    .min(1, 'Seleccione al menos una tabla')
    .max(9, 'Selección inválida')
})

export type TablaInput = z.infer<typeof tablaSchema>
export type ItemTablaInput = z.infer<typeof itemTablaSchema>
