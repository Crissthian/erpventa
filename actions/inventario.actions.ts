'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/auth/permissions'
import { getSession } from '@/auth/session'
import { auditService } from '@/core/infrastructure/logging/audit.service'
import { SqlProductoRepository } from '@/inventario/infrastructure/adapters/sql-producto.repository'
import { ListarProductosConLineaUseCase } from '@/inventario/application/use-cases/listar-productos-con-linea.use-case'
import { ObtenerProductoPorCodigoUseCase } from '@/inventario/application/use-cases/obtener-producto.use-case'
import { GuardarProductoUseCase } from '@/inventario/application/use-cases/guardar-producto.use-case'
import { EliminarProductoUseCase } from '@/inventario/application/use-cases/eliminar-producto.use-case'
import { ProductoRow } from '@/inventario/domain/ports/producto-repository.port'
import { Producto } from '@/inventario/domain/entities/producto.entity'
import { ProductoFormData } from '@/validators/producto.schema'

export async function listarProductosConLineaAction(): Promise<ProductoRow[]> {
  const repository = new SqlProductoRepository()
  const useCase = new ListarProductosConLineaUseCase(repository)
  return useCase.execute()
}

export async function obtenerProductoPorCodigoAction(codigo: string): Promise<Producto | null> {
  const repository = new SqlProductoRepository()
  const useCase = new ObtenerProductoPorCodigoUseCase(repository)
  return useCase.execute(codigo)
}

export async function guardarProductoAction(
  input: ProductoFormData
): Promise<{ ok: boolean; error?: string }> {
  try {
    const session = await getSession()
    if (!session) return { ok: false, error: 'No se encontró una sesión activa' }

    const repository = new SqlProductoRepository()
    
    // Verificar si ya existe para determinar permiso
    const existe = await repository.obtenerPorCodigo(input.codigo)
    if (existe) {
      await requirePermission('inventario.editar')
    } else {
      await requirePermission('inventario.crear')
    }

    const useCase = new GuardarProductoUseCase(repository)
    await useCase.execute({
      codigo: input.codigo,
      linea: input.linea,
      activo: input.activo,
      cEquivalente: input.cEquivalente,
      codBarra: input.codBarra,
      abreviatura: input.abreviatura,
      descripcion: input.descripcion,
      nombre: input.descripcion,
      stock: 0,
      afecto: input.afecto,
      volumen: input.volumen,
      peso: input.peso,
      destVenta: input.destVenta,
      destCompra: input.destCompra,
      tipo: input.tipo,
      procedencia: input.procedencia,
      subFamilia: input.subFamilia,
      undMedida: input.undMedida,
      valorSoles: input.valorSoles,
      valorDolares: input.valorDolares,
      usuarioModificacion: session.username
    })

    await auditService.log(
      session.userId,
      existe ? 'ACTUALIZAR_PRODUCTO' : 'CREAR_PRODUCTO',
      `Producto ${existe ? 'actualizado' : 'creado'} con código: ${input.codigo}, descripción: ${input.descripcion}`
    )

    revalidatePath('/inventario')
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Error al guardar el producto'
    }
  }
}

export async function eliminarProductoAction(
  codigo: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    await requirePermission('inventario.eliminar')

    const session = await getSession()
    if (!session) return { ok: false, error: 'No se encontró una sesión activa' }

    const repository = new SqlProductoRepository()
    const useCase = new EliminarProductoUseCase(repository)
    await useCase.execute(codigo)

    await auditService.log(
      session.userId,
      'ELIMINAR_PRODUCTO',
      `Producto eliminado con código: ${codigo}`
    )

    revalidatePath('/inventario')
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Error al eliminar el producto'
    }
  }
}
