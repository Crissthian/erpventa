'use server'

import { prisma } from '@/core/infrastructure/prisma/client'
import { requirePermission } from '@/auth/permissions'
import { getSession } from '@/auth/session'
import { auditService } from '@/core/infrastructure/logging/audit.service'
import { BuscarCorrelativoUseCase } from '@/configuracion/application/use-cases/buscar-correlativo.use-case'
import {
  GuardarCorrelativoInput,
  GuardarCorrelativoUseCase
} from '@/configuracion/application/use-cases/guardar-correlativo.use-case'
import { ListarCorrelativosUseCase } from '@/configuracion/application/use-cases/listar-correlativos.use-case'
import { SqlPuntoVentaCorrelativoRepository } from '@/configuracion/infrastructure/adapters/sql-punto-venta-correlativo.repository'
import type { CorrelacionTipo, Correlativo } from '@/configuracion/domain/entities/punto-venta-correlativo.entity'

export interface TipoDocumentoItem {
  value: string
  label: string
}

export async function obtenerTiposDocumentoPVAction(): Promise<{
  documento: TipoDocumentoItem[]
  guia: TipoDocumentoItem[]
}> {
  const [documentoRows, guiaRows] = await Promise.all([
    prisma.itemTabla.findMany({
      where: { codigoTabla: 'TDC', swtDet: '1' },
      orderBy: { numeroItem: 'asc' },
      select: { numeroItem: true, descripcionItem: true }
    }),
    prisma.itemTabla.findMany({
      where: { codigoTabla: 'TPG', swtDet: '1' },
      orderBy: { numeroItem: 'asc' },
      select: { numeroItem: true, descripcionItem: true }
    })
  ])

  const toItems = (rows: { numeroItem: string; descripcionItem: string | null }[]): TipoDocumentoItem[] =>
    rows.map((r) => ({ value: r.numeroItem.trim(), label: r.descripcionItem?.trim() ?? '' }))

  return { documento: toItems(documentoRows), guia: toItems(guiaRows) }
}

export async function buscarCorrelativoAction(input: {
  correlacion: CorrelacionTipo
  tipoDocumento: string
  serieDocumento: string
}): Promise<{ numero: string } | null> {
  const repository = new SqlPuntoVentaCorrelativoRepository()
  const useCase = new BuscarCorrelativoUseCase(repository)
  const result = await useCase.execute(input.correlacion, input.tipoDocumento, input.serieDocumento)
  if (!result) return null
  return { numero: result.numero ?? '' }
}

export async function guardarCorrelativoAction(
  input: GuardarCorrelativoInput
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await requirePermission('configuracion.punto-venta.guardar')

    const session = await getSession()
    if (!session) return { error: 'No se encontró una sesión activa' }

    if (!input.tipo || !input.serie || !input.numero) {
      return { error: 'Tipo, serie y número son obligatorios' }
    }

    // Defensa en profundidad: límites físicos reales de las columnas.
    // NUM_SER VARCHAR(3), NUM_DOCU/NUM_GUIA VARCHAR(10).
    if (input.serie.length > 3) {
      return { error: 'La serie no puede exceder 3 caracteres' }
    }
    if (input.numero.length > 10) {
      return { error: 'El número no puede exceder 10 caracteres' }
    }

    const repository = new SqlPuntoVentaCorrelativoRepository()
    const useCase = new GuardarCorrelativoUseCase(repository)
    await useCase.execute(input)

    const accion = input.modo === 'crear' ? 'CREAR_CORRELATIVO' : 'ACTUALIZAR_CORRELATIVO'
    const detalle =
      input.modo === 'crear'
        ? `Correlativo creado en ${input.correlacion}: tipo ${input.tipo}, serie ${input.serie}, número ${input.numero}`
        : `Correlativo actualizado en ${input.correlacion}: tipo ${input.tipo}, serie ${input.serie}, número ${input.numero}`
    await auditService.log(session.userId, accion, detalle)

    return { ok: true }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Error desconocido al guardar correlativo'
    }
  }
}

export async function listarCorrelativosAction(
  correlacion: CorrelacionTipo
): Promise<Correlativo[]> {
  try {
    const repository = new SqlPuntoVentaCorrelativoRepository()
    const useCase = new ListarCorrelativosUseCase(repository)
    return await useCase.execute(correlacion)
  } catch (err) {
    console.error('Error al listar correlativos:', err)
    return []
  }
}
