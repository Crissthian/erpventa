import { CuentasPagarFiltro } from '@/ventas/domain/entities/cuenta-pagar.entity'
import { CuentaPagarRepository } from '@/ventas/domain/ports/cuenta-pagar-repository.port'

export class ListarCuentasPagarPorFiltroUseCase {
  constructor(private readonly repository: CuentaPagarRepository) {}

  async execute(filtro: CuentasPagarFiltro): Promise<ReturnType<CuentaPagarRepository['listarPorFiltro']>> {
    return this.repository.listarPorFiltro({ ...filtro, ruc: filtro.ruc.trim() })
  }
}
