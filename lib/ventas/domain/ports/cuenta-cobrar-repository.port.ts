import type { CuentaCobrar, CuentaCobrarPorRuc, CuentasCobrarFiltro } from '../entities/cuenta-cobrar.entity'

export interface CuentaCobrarRepository {
  /** Lista todas las cuentas por cobrar pendientes */
  listar(): Promise<CuentaCobrar[]>
  /** Lista las cuentas por cobrar según el filtro indicado */
  listarPorFiltro(filtro: CuentasCobrarFiltro): Promise<CuentaCobrarPorRuc[]>
}
