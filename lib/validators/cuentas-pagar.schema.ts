import { z } from 'zod'

export const cuentasPagarFormSchema = z.object({
  proveedor: z.string(),
  direccion: z.string(),
  ruc: z.string(),
  tipoDcto: z.string(),
  moneda: z.string(),
  noDcto: z.string(),
  fechaDcto: z.string(),
  saldo: z.string().refine(
    (val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0),
    'El saldo debe ser un número mayor o igual a 0'
  ),
  vctoDcto: z.string()
})

export type CuentasPagarFormData = z.infer<typeof cuentasPagarFormSchema>
