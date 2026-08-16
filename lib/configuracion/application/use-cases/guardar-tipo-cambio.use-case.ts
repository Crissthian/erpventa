import { TipoCambio } from '@/configuracion/domain/entities/tipo-cambio.entity'
import { TipoCambioRepository } from '@/configuracion/domain/ports/tipo-cambio-repository.port'

export class GuardarTipoCambioUseCase {
  constructor(private readonly tipoCambioRepository: TipoCambioRepository) {}

  async execute(tipoCambio: TipoCambio): Promise<void> {
    return this.tipoCambioRepository.guardar(tipoCambio)
  }
}
