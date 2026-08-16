import type { CuentaCobrar } from '@/ventas/domain/entities/cuenta-cobrar.entity'
import type { CuentaCobrarRepository } from '@/ventas/domain/ports/cuenta-cobrar-repository.port'

export class ListarCuentasCobrarUseCase {
  constructor(private readonly repository: CuentaCobrarRepository) {}

  /** Ejecuta el caso de uso para listar cuentas por cobrar */
  async execute(): Promise<CuentaCobrar[]> {
    return this.repository.listar()
  }
}
