import { z } from 'zod/v4'

export const eliminacionDocumentosSchema = z.object({
  documento: z.string().min(1, 'Seleccione un documento'),
  tipo: z.string().min(1, 'Seleccione un tipo'),
  numero: z.string().min(1, 'Ingrese el número de documento')
})

export type EliminacionDocumentosInput = z.input<typeof eliminacionDocumentosSchema>
