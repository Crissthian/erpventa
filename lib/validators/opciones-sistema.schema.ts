import { z } from 'zod/v4'

const radioOption = z.enum([
  'con_stock',
  'sin_stock',
  'cancelada',
  'pendiente',
  'varios',
  'multiple',
  'automatico',
  'serie',
  'numerico',
  'agente',
  'no_agente',
  'afecto',
  'no_afecto',
  'permite',
  'no_permite',
  'ultimo_costo',
  'promedio'
])

export const opcionesSistemaSchema = z.object({
  manejoStock: radioOption,
  puntoVentaCtaCte: radioOption,
  puntoVentaFacturacion: radioOption,
  correlativoPedido: radioOption,
  correlativoOrdenCompra: radioOption,
  porcRetencion: z.string().max(20),
  importeMaxRetencion: z.string().max(20),
  fechaInicio: z.string().max(20),
  agentePercepcion: radioOption,
  nombreRuc: z.string().max(20),
  nombreIgv: z.string().max(20),
  porcIgv: z.string().max(20),
  deudaVencida: z.string().max(20),
  correlativoCobranza: radioOption,
  maxExcesoOrden: z.string().max(30),
  modificacionPrecios: radioOption,
  costeoProduccion: radioOption
})

export type OpcionesSistemaInput = z.infer<typeof opcionesSistemaSchema>
