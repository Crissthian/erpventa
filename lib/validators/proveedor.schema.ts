// lib/validators/proveedor.schema.ts

import { z } from 'zod'

export const proveedorFormSchema = z.object({
  ruc: z
    .string()
    .min(8, 'El RUC debe tener al menos 8 caracteres')
    .max(15, 'El RUC no puede exceder los 15 caracteres'),
  razonSocial: z
    .string()
    .min(1, 'La Razón Social es obligatoria')
    .max(200, 'La Razón Social no puede exceder los 200 caracteres'),
  direccion: z
    .string()
    .min(1, 'La dirección es obligatoria')
    .max(220, 'La dirección no puede exceder los 220 caracteres'),
  telefono: z.string().max(20, 'El teléfono no puede exceder los 20 caracteres'),
  fax: z.string().max(20, 'El fax no puede exceder los 20 caracteres'),
  correo: z.string().max(30, 'El correo no puede exceder los 30 caracteres'),
  observaciones: z.string(),
  distrito: z.string().max(3, 'El código de distrito no puede exceder los 3 caracteres'),
  inactivo: z.boolean(),
  retencion: z.boolean(),
  exterior: z.boolean(),
  nombreProveedor: z.string().max(60, 'El nombre no puede exceder los 60 caracteres'),
  apellidoPaterno: z.string().max(60, 'El apellido paterno no puede exceder los 60 caracteres'),
  apellidoMaterno: z.string().max(60, 'El apellido materno no puede exceder los 60 caracteres'),
  detraccion: z.boolean(),
  tipoDocumento: z.string().max(3, 'El tipo de documento no puede exceder los 3 caracteres'),
  tipoProveedor: z.string().max(3, 'El tipo de proveedor no puede exceder los 3 caracteres'),
  percepcion: z.boolean()
})

export type ProveedorFormData = z.infer<typeof proveedorFormSchema>
