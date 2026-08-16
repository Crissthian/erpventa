import type { CuentasCobrarFiltro } from '@/ventas/domain/entities/cuenta-cobrar.entity'
import type { CuentaCobrarRepository } from '@/ventas/domain/ports/cuenta-cobrar-repository.port'

export class ListarCuentasCobrarPorFiltroUseCase {
  constructor(private readonly repository: CuentaCobrarRepository) {}

  async execute(filtro: CuentasCobrarFiltro): Promise<ReturnType<CuentaCobrarRepository['listarPorFiltro']>> {
    return this.repository.listarPorFiltro({ ...filtro, ruc: filtro.ruc.trim() })
  }
}
