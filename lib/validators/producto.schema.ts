import { z } from 'zod'

export const productoFormSchema = z.object({
  codigo: z
    .string()
    .min(1, 'El código es obligatorio')
    .max(15, 'El código no puede exceder los 15 caracteres'),
  linea: z
    .string()
    .min(1, 'La línea es obligatoria')
    .max(3, 'El código de línea no puede exceder los 3 caracteres'),
  activo: z.boolean(),
  cEquivalente: z
    .string()
    .max(30, 'El código equivalente no puede exceder los 30 caracteres'),
  codBarra: z
    .string()
    .max(30, 'El código de barras no puede exceder los 30 caracteres'),
  abreviatura: z
    .string()
    .max(60, 'La abreviatura no puede exceder los 60 caracteres'),
  descripcion: z
    .string()
    .min(1, 'La descripción es obligatoria')
    .max(190, 'La descripción no puede exceder los 190 caracteres'),
  afecto: z.boolean(),
  volumen: z.number().min(0, 'El volumen no puede ser negativo'),
  peso: z.number().min(0, 'El peso no puede ser negativo'),
  destVenta: z.boolean(),
  destCompra: z.boolean(),
  tipo: z
    .string()
    .max(3, 'El tipo de producto no puede exceder los 3 caracteres'),
  procedencia: z
    .string()
    .max(3, 'La procedencia no puede exceder los 3 caracteres'),
  subFamilia: z
    .string()
    .max(3, 'La subfamilia no puede exceder los 3 caracteres'),
  undMedida: z
    .string()
    .max(3, 'La unidad de medida no puede exceder los 3 caracteres'),
  valorSoles: z.number().min(0, 'El valor en soles no puede ser negativo'),
  valorDolares: z.number().min(0, 'El valor en dólares no puede ser negativo')
})

export type ProductoFormData = z.infer<typeof productoFormSchema>
