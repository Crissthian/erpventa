'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/auth/permissions'
import { getSession } from '@/auth/session'
import { auditService } from '@/core/infrastructure/logging/audit.service'
import { SqlProveedorRepository } from '@/proveedores/infrastructure/adapters/sql-proveedor.repository'
import { ListarProveedoresUseCase } from '@/proveedores/application/use-cases/listar-proveedores.use-case'
import { ObtenerProveedorPorRucUseCase } from '@/proveedores/application/use-cases/obtener-proveedor.use-case'
import { GuardarProveedorUseCase } from '@/proveedores/application/use-cases/guardar-proveedor.use-case'
import { EliminarProveedorUseCase } from '@/proveedores/application/use-cases/eliminar-proveedor.use-case'
import { ProveedorRow } from '@/proveedores/domain/ports/proveedor-repository.port'
import { Proveedor } from '@/proveedores/domain/entities/proveedor.entity'
import { ProveedorFormData } from '@/validators/proveedor.schema'

export async function listarProveedoresAction(): Promise<ProveedorRow[]> {
  const repository = new SqlProveedorRepository()
  const useCase = new ListarProveedoresUseCase(repository)
  return useCase.execute()
}

export async function obtenerProveedorPorRucAction(ruc: string): Promise<Proveedor | null> {
  const repository = new SqlProveedorRepository()
  const useCase = new ObtenerProveedorPorRucUseCase(repository)
  return useCase.execute(ruc)
}

export async function guardarProveedorAction(
  input: ProveedorFormData
): Promise<{ ok: boolean; error?: string }> {
  try {
    const session = await getSession()
    if (!session) return { ok: false, error: 'No se encontró una sesión activa' }

    const repository = new SqlProveedorRepository()
    
    // Verificar si ya existe para determinar permiso
    const existe = await repository.obtenerPorRuc(input.ruc)
    if (existe) {
      await requirePermission('proveedores.editar')
    } else {
      await requirePermission('proveedores.crear')
    }

    const useCase = new GuardarProveedorUseCase(repository)
    await useCase.execute({
      ruc: input.ruc,
      razonSocial: input.razonSocial,
      direccion: input.direccion,
      telefono: input.telefono,
      fax: input.fax,
      correo: input.correo,
      observaciones: input.observaciones,
      distrito: input.distrito,
      inactivo: input.inactivo,
      retencion: input.retencion,
      exterior: input.exterior,
      nombreProveedor: input.nombreProveedor,
      apellidoPaterno: input.apellidoPaterno,
      apellidoMaterno: input.apellidoMaterno,
      detraccion: input.detraccion,
      tipoDocumento: input.tipoDocumento,
      tipoProveedor: input.tipoProveedor,
      percepcion: input.percepcion,
      usuarioModificacion: session.username
    })

    await auditService.log(
      session.userId,
      existe ? 'ACTUALIZAR_PROVEEDOR' : 'CREAR_PROVEEDOR',
      `Proveedor ${existe ? 'actualizado' : 'creado'} con RUC: ${input.ruc}, Razón Social: ${input.razonSocial}`
    )

    revalidatePath('/proveedores')
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Error al guardar el proveedor'
    }
  }
}

export async function eliminarProveedorAction(
  ruc: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    await requirePermission('proveedores.eliminar')

    const session = await getSession()
    if (!session) return { ok: false, error: 'No se encontró una sesión activa' }

    const repository = new SqlProveedorRepository()
    const useCase = new EliminarProveedorUseCase(repository)
    await useCase.execute(ruc)

    await auditService.log(
      session.userId,
      'ELIMINAR_PROVEEDOR',
      `Proveedor eliminado con RUC: ${ruc}`
    )

    revalidatePath('/proveedores')
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Error al eliminar el proveedor'
    }
  }
}
