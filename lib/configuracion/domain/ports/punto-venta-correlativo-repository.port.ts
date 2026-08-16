import { CorrelacionTipo, Correlativo } from '@/configuracion/domain/entities/punto-venta-correlativo.entity'

export interface PuntoVentaCorrelativoRepository {
  buscarPorTipoYSerie(
    correlacion: CorrelacionTipo,
    tipo: string,
    serie: string
  ): Promise<Correlativo | null>
  crear(input: {
    correlacion: CorrelacionTipo
    tipo: string
    serie: string
    numero: string
  }): Promise<void>
  actualizarNumero(
    correlacion: CorrelacionTipo,
    tipo: string,
    serie: string,
    numero: string
  ): Promise<void>
  listar(correlacion: CorrelacionTipo): Promise<Correlativo[]>
}
