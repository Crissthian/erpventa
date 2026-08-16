import { z } from 'zod'

export const usuarioFormSchema = z.object({
  login: z
    .string()
    .min(1, 'El usuario de acceso es obligatorio')
    .max(10, 'Máximo 10 caracteres'),
  nombre: z
    .string()
    .min(1, 'El nombre del usuario es obligatorio')
    .max(60, 'Máximo 60 caracteres'),
  nivelAcceso: z.enum(['1', '2', '3'], {
    message: 'Seleccione un nivel de acceso válido'
  }),
  activo: z.boolean(),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .max(10, 'Máximo 10 caracteres'),
  puntosVenta: z.object({
    guiasRemision: z.string().max(4, 'Máximo 4 caracteres'),
    factura: z.string().max(4, 'Máximo 4 caracteres'),
    boleta: z.string().max(4, 'Máximo 4 caracteres'),
    notaCreditoF: z.string().max(4, 'Máximo 4 caracteres'),
    notaCreditoB: z.string().max(4, 'Máximo 4 caracteres'),
    notaDebito: z.string().max(4, 'Máximo 4 caracteres')
  })
})

export type UsuarioFormData = z.infer<typeof usuarioFormSchema>
