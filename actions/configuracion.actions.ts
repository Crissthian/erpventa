'use server'

import { Prisma } from '@prisma/client'

import { requirePermission } from '@/auth/permissions'
import { getSession } from '@/auth/session'
import { GuardarOpcionesSistemaUseCase } from '@/configuracion/application/use-cases/guardar-opciones-sistema.use-case'
import { GuardarOpcionUsuarioUseCase } from '@/configuracion/application/use-cases/guardar-opcion-usuario.use-case'
import { ObtenerOpcionesSistemaUseCase } from '@/configuracion/application/use-cases/obtener-opciones-sistema.use-case'
import { OpcionesSistema } from '@/configuracion/domain/entities/opciones-sistema.entity'
import { PrismaOpcionesSistemaRepository } from '@/configuracion/infrastructure/adapters/prisma-opciones-sistema.repository'
import { SqlOpcionUsuarioRepository } from '@/configuracion/infrastructure/adapters/sql-opcion-usuario.repository'
import { auditService } from '@/core/infrastructure/logging/audit.service'
import { prisma } from '@/core/infrastructure/prisma/client'
import { opcionesSistemaSchema } from '@/validators/opciones-sistema.schema'
import {
  eliminarOpcionUsuarioSchema,
  guardarOpcionUsuarioSchema
} from '@/validators/asignacion-opciones.schema'
import { z } from 'zod'

const RADIO_TO_NUM: Record<string, number> = {
  con_stock: 1,
  sin_stock: 2,
  cancelada: 1,
  pendiente: 2,
  varios: 1,
  multiple: 2,
  automatico: 1,
  serie: 2,
  numerico: 2,
  agente: 1,
  no_agente: 2,
  afecto: 1,
  no_afecto: 2,
  permite: 1,
  no_permite: 2,
  ultimo_costo: 1,
  promedio: 2
}

function toNumber(value: string): number {
  const n = parseFloat(value)
  return isNaN(n) ? 0 : n
}

export async function obtenerOpcionesSistemaAction(): Promise<OpcionesSistema | null> {
  const repository = new PrismaOpcionesSistemaRepository()
  const useCase = new ObtenerOpcionesSistemaUseCase(repository)
  return useCase.execute()
}

export async function guardarOpcionesSistemaAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await requirePermission('configuracion.opciones.editar')

    const session = await getSession()
    if (!session) return { error: 'No se encontró una sesión activa' }

    const parsed = opcionesSistemaSchema.safeParse({
      manejoStock: formData.get('manejoStock'),
      puntoVentaCtaCte: formData.get('puntoVentaCtaCte'),
      puntoVentaFacturacion: formData.get('puntoVentaFacturacion'),
      correlativoPedido: formData.get('correlativoPedido'),
      correlativoOrdenCompra: formData.get('correlativoOrdenCompra'),
      porcRetencion: formData.get('porcRetencion'),
      importeMaxRetencion: formData.get('importeMaxRetencion'),
      fechaInicio: formData.get('fechaInicio'),
      agentePercepcion: formData.get('agentePercepcion'),
      nombreRuc: formData.get('nombreRuc'),
      nombreIgv: formData.get('nombreIgv'),
      porcIgv: formData.get('porcIgv'),
      deudaVencida: formData.get('deudaVencida'),
      correlativoCobranza: formData.get('correlativoCobranza'),
      maxExcesoOrden: formData.get('maxExcesoOrden'),
      modificacionPrecios: formData.get('modificacionPrecios'),
      costeoProduccion: formData.get('costeoProduccion')
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const d = parsed.data
    const opciones: OpcionesSistema = {
      mstock: RADIO_TO_NUM[d.manejoStock] ?? 2,
      mcancel: RADIO_TO_NUM[d.puntoVentaCtaCte] ?? 2,
      nruc: d.nombreRuc,
      nigv: d.nombreIgv,
      nporigv: toNumber(d.porcIgv),
      n1: RADIO_TO_NUM[d.puntoVentaFacturacion] ?? 1,
      n2: RADIO_TO_NUM[d.correlativoPedido] ?? 1,
      n3: null,
      n4: d.fechaInicio,
      n5: d.porcRetencion,
      n6: d.importeMaxRetencion,
      n7: null,
      nref1: RADIO_TO_NUM[d.correlativoCobranza] ?? 1,
      cref1: d.maxExcesoOrden,
      nref2: RADIO_TO_NUM[d.costeoProduccion] ?? 1,
      cref2: RADIO_TO_NUM[d.modificacionPrecios]?.toString() ?? '1',
      nref3: RADIO_TO_NUM[d.correlativoOrdenCompra] ?? 1,
      cref3: RADIO_TO_NUM[d.agentePercepcion]?.toString() ?? '1',
      nref4: toNumber(d.deudaVencida),
      cref4: null
    }

    const repository = new PrismaOpcionesSistemaRepository()
    const useCase = new GuardarOpcionesSistemaUseCase(repository)
    await useCase.execute(opciones)

    await auditService.log(
      session.userId,
      'GUARDAR_OPCIONES_SISTEMA',
      'Opciones del sistema actualizadas'
    )

    return { ok: true }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Error desconocido al guardar opciones'
    }
  }
}

// ── Usuarios ──────────────────────────────────────────────────────

export interface UsuarioSimpleDto {
  codigo: string
  nombre: string
}

export async function listarUsuariosSimpleAction(): Promise<UsuarioSimpleDto[]> {
  const rows = await prisma.$queryRaw<Array<{ codigo: string; nombre: string }>>(Prisma.sql`
    SELECT LTRIM(RTRIM(CDG_USR)) as codigo, LTRIM(RTRIM(DES_USR)) as nombre
    FROM M_USUARI
    ORDER BY DES_USR
  `)
  return rows
}

// ── Opciones asignadas por usuario ─────────────────────────────

export interface OpcionAsignadaDto {
  codigoModulo: string
  numeroItem: string
  modulo: string
  opcion: string
}

export async function listarOpcionesUsuarioAction(
  codigoUsuario: string
): Promise<OpcionAsignadaDto[]> {
  const rows = await prisma.$queryRaw<
    Array<{ codigoModulo: string; numeroItem: string; modulo: string; opcion: string }>
  >(Prisma.sql`
    SELECT LTRIM(RTRIM(du.CDG_OPC)) as codigoModulo, LTRIM(RTRIM(du.NUM_ITEM)) as numeroItem, mo.DES_OPC as modulo, do.DES_ITEM as opcion
    FROM D_USUARI as du
    INNER JOIN D_OPCION as do ON du.CDG_OPC = do.CDG_OPC AND du.NUM_ITEM = do.NUM_ITEM
    INNER JOIN m_opcion as mo ON du.CDG_OPC = mo.CDG_OPC
    WHERE du.CDG_USR = ${codigoUsuario}
    ORDER BY DES_OPC, DES_ITEM
  `)
  return rows.map((r) => ({
    codigoModulo: r.codigoModulo.trim(),
    numeroItem: r.numeroItem.trim(),
    modulo: r.modulo.trim(),
    opcion: r.opcion.trim()
  }))
}

// ── Catálogo de modulos y opciones para asignación ─────────────

export interface ModuloItemDto {
  codigo: string
  descripcion: string
}

export interface OpcionCatalogoDto {
  codigoModulo: string
  numeroItem: string
  descripcion: string
}

export async function listarModulosAction(): Promise<ModuloItemDto[]> {
  const rows = await prisma.$queryRaw<Array<{ codigo: string; descripcion: string }>>(Prisma.sql`
    SELECT LTRIM(RTRIM(CDG_OPC)) as codigo, LTRIM(RTRIM(DES_OPC)) as descripcion
    FROM m_opcion
    WHERE SWT_OPC = 1
    ORDER BY DES_OPC
  `)
  return rows
}

export async function listarOpcionesCatalogoAction(): Promise<OpcionCatalogoDto[]> {
  const rows = await prisma.$queryRaw<
    Array<{ codigoModulo: string; numeroItem: string; descripcion: string }>
  >(Prisma.sql`
    SELECT LTRIM(RTRIM(CDG_OPC)) as codigoModulo, LTRIM(RTRIM(NUM_ITEM)) as numeroItem, LTRIM(RTRIM(DES_ITEM)) as descripcion
    FROM D_OPCION
    WHERE SWT_ITEM = 1
    ORDER BY CDG_OPC, NUM_ITEM
  `)
  return rows
}

export async function guardarOpcionUsuarioAction(input: {
  codigoUsuario: string
  codigoOpcion: string
  numeroItem: string
  estado: string
}): Promise<{ ok?: boolean; error?: string }> {
  try {
    await requirePermission('configuracion.opciones.asignar')

    const session = await getSession()
    if (!session) return { error: 'No se encontró una sesión activa' }

    const parsed = guardarOpcionUsuarioSchema.safeParse(input)
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const repository = new SqlOpcionUsuarioRepository()
    const useCase = new GuardarOpcionUsuarioUseCase(repository)
    await useCase.execute({
      codigoUsuario: parsed.data.codigoUsuario,
      codigoOpcion: parsed.data.codigoOpcion,
      numeroItem: parsed.data.numeroItem,
      swtOpc: Number(parsed.data.estado)
    })

    await auditService.log(
      session.userId,
      'ASIGNAR_OPCION',
      `Opción ${parsed.data.codigoOpcion}-${parsed.data.numeroItem} asignada a usuario ${parsed.data.codigoUsuario} con estado ${parsed.data.estado}`
    )

    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido al asignar opción' }
  }
}

export async function eliminarOpcionUsuarioAction(input: {
  codigoUsuario: string
  codigoOpcion: string
  numeroItem: string
}): Promise<{ ok?: boolean; error?: string }> {
  try {
    await requirePermission('configuracion.opciones.asignar')

    const session = await getSession()
    if (!session) return { error: 'No se encontró una sesión activa' }

    const parsed = eliminarOpcionUsuarioSchema.safeParse(input)
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const codigoUsuario = parsed.data.codigoUsuario.trim().toUpperCase().padEnd(10)
    const codigoOpcion = parsed.data.codigoOpcion.trim().toUpperCase().padEnd(3)
    const numeroItem = parsed.data.numeroItem.trim().padStart(3, '0')

    await prisma.$executeRaw(Prisma.sql`
      DELETE FROM D_USUARI
      WHERE CDG_USR = ${codigoUsuario}
        AND CDG_OPC = ${codigoOpcion}
        AND NUM_ITEM = ${numeroItem}
    `)

    await auditService.log(
      session.userId,
      'ELIMINAR_OPCION',
      `Opción ${codigoOpcion}-${numeroItem} eliminada de usuario ${codigoUsuario}`
    )

    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido al eliminar opción' }
  }
}

// ── Tipos de documento para eliminación ─────────────────────────────

export interface TipoDocumentoDto {
  numItem: string
  desItem: string
}

export async function listarTiposDocumentoAction(
  tipo: 'documento' | 'guia'
): Promise<TipoDocumentoDto[]> {
  if (tipo === 'documento') {
    const rows = await prisma.$queryRaw<Array<{ num_item: string; des_item: string }>>(Prisma.sql`
      SELECT LTRIM(RTRIM(NUM_ITEM)) as num_item, LTRIM(RTRIM(DES_ITEM)) as des_item
      FROM D_TABLAS
      WHERE CDG_TAB = 'TDC'
        AND NUM_ITEM <> '003'
        AND SWT_ITEM = 1
      ORDER BY DES_ITEM
    `)
    return rows.map((r) => ({ numItem: r.num_item.trim(), desItem: r.des_item.trim() }))
  } else {
    const rows = await prisma.$queryRaw<Array<{ num_item: string; des_item: string }>>(Prisma.sql`
      SELECT LTRIM(RTRIM(NUM_ITEM)) as num_item, LTRIM(RTRIM(DES_ITEM)) as des_item
      FROM D_TABLAS
      WHERE CDG_TAB = 'TPG'
        AND SWT_ITEM = 1
        AND NUM_ITEM = '003'
      ORDER BY DES_ITEM
    `)
    return rows.map((r) => ({ numItem: r.num_item.trim(), desItem: r.des_item.trim() }))
  }
}

export async function eliminarDocumentosAction(input: {
  cdgTdoc: string
  numDocu: string
}): Promise<{
  ok?: boolean
  error?: string
  eliminadosM?: number
  eliminadosD?: number
  eliminadosC?: number
}> {
  try {
    const parsed = z
      .object({
        cdgTdoc: z.string().min(1, 'Tipo de documento requerido'),
        numDocu: z.string().min(1, 'Número de documento requerido')
      })
      .safeParse(input)
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const cdgTdoc = parsed.data.cdgTdoc.trim().padStart(3, '0')
    const numDocu = parsed.data.numDocu.trim()

    const [eliminadosM, eliminadosD, eliminadosC] = await prisma.$transaction([
      prisma.$executeRaw(
        Prisma.sql`DELETE FROM M_DOCCLI WHERE CDG_TDOC = ${cdgTdoc} AND NUM_DOCU = ${numDocu}`
      ),
      prisma.$executeRaw(
        Prisma.sql`DELETE FROM D_DOCCLI WHERE CDG_TDOC = ${cdgTdoc} AND NUM_DOCU = ${numDocu}`
      ),
      prisma.$executeRaw(
        Prisma.sql`DELETE FROM M_CTECLI WHERE CDG_TDOC = ${cdgTdoc} AND NUM_DOCU = ${numDocu}`
      )
    ])

    return { ok: true, eliminadosM, eliminadosD, eliminadosC }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido al eliminar documento' }
  }
}
