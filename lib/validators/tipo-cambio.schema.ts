import { z } from 'zod/v4'

const monedaRegex = /^\d{1,4}(\.\d{1,3})?$/

export const tipoCambioSchema = z.object({
  venta: z
    .string()
    .regex(monedaRegex, 'Venta: máximo 4 enteros y 3 decimales')
    .transform((v) => Number(v)),
  compra: z
    .string()
    .regex(monedaRegex, 'Compra: máximo 4 enteros y 3 decimales')
    .transform((v) => Number(v))
})

export type TipoCambioInput = z.infer<typeof tipoCambioSchema>
