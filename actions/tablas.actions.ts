'use server'

import { requirePermission } from '@/auth/permissions'
import { getSession } from '@/auth/session'
import { auditService } from '@/core/infrastructure/logging/audit.service'
import { ActualizarItemTablaUseCase } from '@/configuracion/application/use-cases/actualizar-item-tabla.use-case'
import { ActualizarTablaUseCase } from '@/configuracion/application/use-cases/actualizar-tabla.use-case'
import { CrearItemTablaUseCase } from '@/configuracion/application/use-cases/crear-item-tabla.use-case'
import { CrearTablaUseCase } from '@/configuracion/application/use-cases/crear-tabla.use-case'
import { EliminarItemTablaUseCase } from '@/configuracion/application/use-cases/eliminar-item-tabla.use-case'
import { EliminarTablaUseCase } from '@/configuracion/application/use-cases/eliminar-tabla.use-case'
import { LimpiarTablasMaestrasUseCase } from '@/configuracion/application/use-cases/limpiar-tablas-maestras.use-case'
import { ObtenerItemsTablaUseCase } from '@/configuracion/application/use-cases/obtener-items-tabla.use-case'
import { ObtenerTablasUseCase } from '@/configuracion/application/use-cases/obtener-tablas.use-case'
import { SqlTablaRepository } from '@/configuracion/infrastructure/adapters/sql-tabla.repository'
import { LimpiezaTablaResultado } from '@/configuracion/domain/entities/tabla.entity'
import { itemTablaSchema, limpiezaTablasSchema, tablaSchema } from '@/validators/tablas.schema'

export async function obtenerTablasAction() {
  const repository = new SqlTablaRepository()
  const useCase = new ObtenerTablasUseCase(repository)
  return useCase.execute()
}

export async function obtenerItemsTablaAction(codigoTabla: string) {
  const repository = new SqlTablaRepository()
  const useCase = new ObtenerItemsTablaUseCase(repository)
  return useCase.execute(codigoTabla)
}

export async function crearTablaAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await requirePermission('configuracion.tablas.crear')

    const session = await getSession()
    if (!session) return { error: 'No se encontró una sesión activa' }

    const parsed = tablaSchema.safeParse({
      codigo: formData.get('codigo'),
      descripcion: formData.get('descripcion')
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const repository = new SqlTablaRepository()
    const useCase = new CrearTablaUseCase(repository)
    await useCase.execute(parsed.data.codigo.toUpperCase(), parsed.data.descripcion)

    await auditService.log(
      session.userId,
      'CREAR_TABLA',
      `Tabla creada con código: ${parsed.data.codigo.toUpperCase()}, nombre: ${parsed.data.descripcion}`
    )

    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido al crear tabla' }
  }
}

export async function actualizarTablaAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await requirePermission('configuracion.tablas.editar')

    const session = await getSession()
    if (!session) return { error: 'No se encontró una sesión activa' }

    const parsed = tablaSchema.safeParse({
      codigo: formData.get('codigo'),
      descripcion: formData.get('descripcion')
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const repository = new SqlTablaRepository()
    const useCase = new ActualizarTablaUseCase(repository)
    await useCase.execute(parsed.data.codigo.toUpperCase(), parsed.data.descripcion)

    await auditService.log(
      session.userId,
      'ACTUALIZAR_TABLA',
      `Tabla actualizada con código: ${parsed.data.codigo.toUpperCase()}, nombre: ${parsed.data.descripcion}`
    )

    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido al actualizar tabla' }
  }
}

export async function eliminarTablaAction(
  codigo: string
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await requirePermission('configuracion.tablas.eliminar')

    const session = await getSession()
    if (!session) return { error: 'No se encontró una sesión activa' }

    const repository = new SqlTablaRepository()
    const useCase = new EliminarTablaUseCase(repository)
    await useCase.execute(codigo)

    await auditService.log(
      session.userId,
      'ELIMINAR_TABLA',
      `Tabla eliminada con código: ${codigo}`
    )

    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido al eliminar tabla' }
  }
}

export async function crearItemTablaAction(_prevState: unknown, formData: FormData) {
  const parsed = itemTablaSchema.safeParse({
    codigoTabla: formData.get('codigoTabla'),
    numeroItem: formData.get('numeroItem'),
    descripcionItem: formData.get('descripcionItem')
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const repository = new SqlTablaRepository()
  const useCase = new CrearItemTablaUseCase(repository)
  await useCase.execute(
    parsed.data.codigoTabla,
    parsed.data.numeroItem,
    parsed.data.descripcionItem
  )
  return { ok: true }
}

export async function actualizarItemTablaAction(_prevState: unknown, formData: FormData) {
  const parsed = itemTablaSchema.safeParse({
    codigoTabla: formData.get('codigoTabla'),
    numeroItem: formData.get('numeroItem'),
    descripcionItem: formData.get('descripcionItem')
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const repository = new SqlTablaRepository()
  const useCase = new ActualizarItemTablaUseCase(repository)
  await useCase.execute(
    parsed.data.codigoTabla,
    parsed.data.numeroItem,
    parsed.data.descripcionItem
  )
  return { ok: true }
}

export async function eliminarItemTablaAction(codigoTabla: string, numeroItem: string) {
  const repository = new SqlTablaRepository()
  const useCase = new EliminarItemTablaUseCase(repository)
  await useCase.execute(codigoTabla, numeroItem)
  return { ok: true }
}

export async function limpiarTablasMaestrasAction(
  idsSeleccionados: string[]
): Promise<{ ok?: boolean; error?: string; resultados?: LimpiezaTablaResultado[] }> {
  try {
    await requirePermission('configuracion.tablas.limpiar')

    const session = await getSession()
    if (!session) return { error: 'No se encontró una sesión activa' }

    const parsed = limpiezaTablasSchema.safeParse({ ids: idsSeleccionados })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const repository = new SqlTablaRepository()
    const useCase = new LimpiarTablasMaestrasUseCase(repository)
    const resultados = await useCase.execute(parsed.data.ids)

    if (resultados.length > 0) {
      await auditService.log(
        session.userId,
        'LIMPIAR_TABLAS_MAESTRAS',
        `Tablas procesadas: ${resultados
          .map((r) => `${r.label} (${r.eliminados} registros)`)
          .join(', ')}`
      )
    }

    return { ok: true, resultados }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido al limpiar tablas' }
  }
}
