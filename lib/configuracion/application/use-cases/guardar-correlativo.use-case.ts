import { CorrelacionTipo } from '@/configuracion/domain/entities/punto-venta-correlativo.entity'
import { PuntoVentaCorrelativoRepository } from '@/configuracion/domain/ports/punto-venta-correlativo-repository.port'

export type GuardarCorrelativoModo = 'crear' | 'actualizar'

export interface GuardarCorrelativoInput {
  correlacion: CorrelacionTipo
  tipo: string
  serie: string
  numero: string
  modo: GuardarCorrelativoModo
}

export class GuardarCorrelativoUseCase {
  constructor(private readonly repository: PuntoVentaCorrelativoRepository) {}

  async execute(input: GuardarCorrelativoInput): Promise<void> {
    if (input.modo === 'crear') {
      await this.repository.crear({
        correlacion: input.correlacion,
        tipo: input.tipo,
        serie: input.serie,
        numero: input.numero
      })
      return
    }
    await this.repository.actualizarNumero(input.correlacion, input.tipo, input.serie, input.numero)
  }
}
