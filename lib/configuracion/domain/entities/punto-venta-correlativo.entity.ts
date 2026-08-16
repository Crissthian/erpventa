export type CorrelacionTipo = 'documento' | 'guia'

export interface Correlativo {
  tipoDocumento: string
  serie: string
  numero: string | null
}
