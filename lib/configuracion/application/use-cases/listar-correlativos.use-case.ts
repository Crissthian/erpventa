import { CorrelacionTipo, Correlativo } from '@/configuracion/domain/entities/punto-venta-correlativo.entity'
import { PuntoVentaCorrelativoRepository } from '@/configuracion/domain/ports/punto-venta-correlativo-repository.port'

export class ListarCorrelativosUseCase {
  constructor(private readonly repository: PuntoVentaCorrelativoRepository) {}

  async execute(correlacion: CorrelacionTipo): Promise<Correlativo[]> {
    if (correlacion !== 'documento' && correlacion !== 'guia') {
      return []
    }
    return this.repository.listar(correlacion)
  }
}
