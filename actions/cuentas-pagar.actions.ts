'use server'

import { requirePermission } from '@/auth/permissions'
import { ListarCuentasPagarPorFiltroUseCase } from '@/ventas/application/use-cases/listar-cuentas-pagar-por-filtro.use-case'
import { sqlCuentaPagarRepository } from '@/ventas/infrastructure/adapters/sql-cuenta-pagar.repository'
import type {
  CuentaPagarPorRuc,
  CuentasPagarFiltro
} from '@/ventas/domain/entities/cuenta-pagar.entity'

const listarPorFiltroUseCase = new ListarCuentasPagarPorFiltroUseCase(
  sqlCuentaPagarRepository
)

export async function listarCuentasPagarPorFiltroAction(
  filtro: CuentasPagarFiltro
): Promise<CuentaPagarPorRuc[]> {
  await requirePermission('cuentas_pagar_listar')
  try {
    return await listarPorFiltroUseCase.execute(filtro)
  } catch (error) {
    console.error('Error al listar cuentas por pagar:', error)
    return []
  }
}
