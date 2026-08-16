'use server'

import { requirePermission } from '@/auth/permissions'
import { ListarCuentasCobrarUseCase } from '@/ventas/application/use-cases/listar-cuentas-cobrar.use-case'
import { ListarCuentasCobrarPorFiltroUseCase } from '@/ventas/application/use-cases/listar-cuentas-cobrar-por-filtro.use-case'
import { ListarClientesSelectUseCase } from '@/ventas/application/use-cases/listar-clientes-select.use-case'
import { BuscarClientesUseCase } from '@/ventas/application/use-cases/buscar-clientes.use-case'
import { sqlCuentaCobrarRepository } from '@/ventas/infrastructure/adapters/sql-cuenta-cobrar.repository'
import { prismaClienteRepository } from '@/ventas/infrastructure/adapters/prisma-cliente.repository'
import type {
  CuentaCobrar,
  CuentaCobrarPorRuc,
  CuentasCobrarFiltro
} from '@/ventas/domain/entities/cuenta-cobrar.entity'
import type { ClienteSelectItem } from '@/ventas/domain/entities/cliente.entity'

const useCase = new ListarCuentasCobrarUseCase(sqlCuentaCobrarRepository)
const listarPorFiltroUseCase = new ListarCuentasCobrarPorFiltroUseCase(sqlCuentaCobrarRepository)
const listarClientesUseCase = new ListarClientesSelectUseCase(prismaClienteRepository)
const buscarClientesUseCase = new BuscarClientesUseCase(prismaClienteRepository)

export async function listarCuentasCobrarAction(): Promise<CuentaCobrar[]> {
  await requirePermission('cuentas_cobrar_listar')
  try {
    const cuentas = await useCase.execute()
    return cuentas
  } catch (error) {
    console.error('Error al listar cuentas por cobrar:', error)
    return []
  }
}

export async function listarCuentasCobrarPorFiltroAction(
  filtro: CuentasCobrarFiltro
): Promise<CuentaCobrarPorRuc[]> {
  await requirePermission('cuentas_cobrar_listar')
  try {
    return await listarPorFiltroUseCase.execute(filtro)
  } catch (error) {
    console.error('Error al listar cuentas por cobrar:', error)
    return []
  }
}

export async function listarClientesSelectAction(): Promise<ClienteSelectItem[]> {
  await requirePermission('cuentas_cobrar_listar')
  try {
    return await listarClientesUseCase.execute()
  } catch (error) {
    console.error('Error al listar clientes:', error)
    return []
  }
}

export async function buscarClientesAction(term: string): Promise<ClienteSelectItem[]> {
  await requirePermission('cuentas_cobrar_listar')
  try {
    return await buscarClientesUseCase.execute(term)
  } catch (error) {
    console.error('Error al buscar clientes:', error)
    return []
  }
}
