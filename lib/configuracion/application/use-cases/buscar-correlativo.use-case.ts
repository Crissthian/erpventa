import { CorrelacionTipo, Correlativo } from '@/configuracion/domain/entities/punto-venta-correlativo.entity'
import { PuntoVentaCorrelativoRepository } from '@/configuracion/domain/ports/punto-venta-correlativo-repository.port'

export class BuscarCorrelativoUseCase {
  constructor(private readonly repository: PuntoVentaCorrelativoRepository) {}

  async execute(
    correlacion: CorrelacionTipo,
    tipo: string,
    serie: string
  ): Promise<Correlativo | null> {
    return this.repository.buscarPorTipoYSerie(correlacion, tipo, serie)
  }
}
