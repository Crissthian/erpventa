import { z } from 'zod'

export const clienteSchema = z.object({
  ruc: z
    .string()
    .min(8, 'El RUC debe tener al menos 8 caracteres')
    .max(30, 'El RUC no puede exceder los caracteres')
    .regex(/^\d+$/, 'El RUC debe contener solo dígitos')
    .transform((val) => val.trim()),
  razonSocial: z
    .string()
    .min(3, 'La Razón Social debe tener al menos 3 caracteres')
    .max(240, 'La Razón Social no puede exceder los 240 caracteres')
    .transform((val) => val.trim().toUpperCase()),
  direccion: z
    .string()
    .max(240, 'La dirección no puede exceder los 240 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => val?.trim().toUpperCase() || ''),
  telefono: z
    .string()
    .max(20, 'El teléfono no puede exceder los 20 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => val?.trim() || ''),
  fax: z
    .string()
    .max(20, 'El fax no puede exceder los 20 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => val?.trim() || ''),
  activo: z.coerce.number().min(0).max(1).default(1),
  codigoProvincia: z
    .string()
    .max(20, 'El código de provincia no puede exceder los 20 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => val?.trim() || ''),
  codigoDistrito: z
    .string()
    .max(3, 'El código de distrito no puede exceder los 3 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => val?.trim() || ''),
  codigoTipoCliente: z
    .string()
    .max(3, 'El código de tipo de cliente no puede exceder los 3 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => val?.trim() || ''),
  codigoCondicionPago: z
    .string()
    .max(3, 'El código de condición de pago no puede exceder los 3 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => val?.trim() || ''),
  codigoVendedor: z
    .string()
    .max(3, 'El código de vendedor no puede exceder los 3 caracteres')
    .optional()
    .or(z.literal(''))
    .transform((val) => val?.trim() || '')
})

export type ClienteSchemaInput = z.infer<typeof clienteSchema>
