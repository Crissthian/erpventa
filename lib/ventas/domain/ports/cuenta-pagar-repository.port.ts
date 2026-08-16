import { CuentasPagarFiltro, CuentaPagarPorRuc } from '../entities/cuenta-pagar.entity'

export interface CuentaPagarRepository {
  listarPorFiltro(filtro: CuentasPagarFiltro): Promise<CuentaPagarPorRuc[]>
}
