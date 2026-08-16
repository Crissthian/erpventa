import { TipoCambio } from '@/configuracion/domain/entities/tipo-cambio.entity'
import { TipoCambioRepository } from '@/configuracion/domain/ports/tipo-cambio-repository.port'

export class ListarHistorialTipoCambioUseCase {
  constructor(private readonly tipoCambioRepository: TipoCambioRepository) {}

  async execute(): Promise<TipoCambio[]> {
    return this.tipoCambioRepository.listarHistorial()
  }
}
