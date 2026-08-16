'use server'

import { revalidatePath } from 'next/cache'
import { requirePermission } from '@/auth/permissions'
import { getSession } from '@/auth/session'
import { auditService } from '@/core/infrastructure/logging/audit.service'
import { clienteSchema } from '@/validators/cliente.schema'
import { ActualizarClienteUseCase } from '@/ventas/application/use-cases/actualizar-cliente.use-case'
import { GuardarClienteUseCase } from '@/ventas/application/use-cases/guardar-cliente.use-case'
import { EliminarClienteUseCase } from '@/ventas/application/use-cases/eliminar-cliente.use-case'
import { ObtenerClientesUseCase } from '@/ventas/application/use-cases/obtener-clientes.use-case'
import { ObtenerCondicionesPagoUseCase } from '@/ventas/application/use-cases/obtener-condiciones-pago.use-case'
import { ObtenerDistritosUseCase } from '@/ventas/application/use-cases/obtener-distritos.use-case'
import { ObtenerMonedasUseCase } from '@/ventas/application/use-cases/obtener-monedas.use-case'
import { ObtenerProvinciasUseCase } from '@/ventas/application/use-cases/obtener-provincias.use-case'
import { ObtenerTiposClienteUseCase } from '@/ventas/application/use-cases/obtener-tipos-cliente.use-case'
import { ObtenerTiposDocumentoUseCase } from '@/ventas/application/use-cases/obtener-tipos-documento.use-case'
import { ObtenerVendedoresUseCase } from '@/ventas/application/use-cases/obtener-vendedores.use-case'
import { ObtenerLineasUseCase } from '@/ventas/application/use-cases/obtener-lineas.use-case'
import { ObtenerTiposProductoUseCase } from '@/ventas/application/use-cases/obtener-tipos-producto.use-case'
import { ObtenerProcedenciasUseCase } from '@/ventas/application/use-cases/obtener-procedencias.use-case'
import { ObtenerSubFamiliasUseCase } from '@/ventas/application/use-cases/obtener-sub-familias.use-case'
import { ObtenerUnidadesMedidaUseCase } from '@/ventas/application/use-cases/obtener-unidades-medida.use-case'
import { ObtenerTiposProveedorUseCase } from '@/ventas/application/use-cases/obtener-tipos-proveedor.use-case'
import { ListarProveedoresSelectUseCase } from '@/ventas/application/use-cases/listar-proveedores-select.use-case'
import { BuscarProveedoresUseCase } from '@/ventas/application/use-cases/buscar-proveedores.use-case'
import { ObtenerSiguienteCodigoProductoUseCase } from '@/ventas/application/use-cases/obtener-siguiente-codigo-producto.use-case'
import { Cliente } from '@/ventas/domain/entities/cliente.entity'
import { ProveedorSelectItem } from '@/ventas/domain/entities/proveedor.entity'
import { SelectOption } from '@/ventas/domain/entities/select-option.entity'
import { PrismaClienteRepository } from '@/ventas/infrastructure/adapters/prisma-cliente.repository'
import { PrismaProveedorRepository } from '@/ventas/infrastructure/adapters/prisma-proveedor.repository'
import { PrismaSelectOptionsRepository } from '@/ventas/infrastructure/adapters/prisma-select-options.repository'

export async function obtenerClientesAction(): Promise<Cliente[]> {
  const clienteRepository = new PrismaClienteRepository()
  const useCase = new ObtenerClientesUseCase(clienteRepository)
  return useCase.execute()
}

export async function obtenerProvinciasAction(): Promise<SelectOption[]> {
  const repository = new PrismaSelectOptionsRepository()
  const useCase = new ObtenerProvinciasUseCase(repository)
  return useCase.execute()
}

export async function obtenerDistritosAction(): Promise<SelectOption[]> {
  const repository = new PrismaSelectOptionsRepository()
  const useCase = new ObtenerDistritosUseCase(repository)
  return useCase.execute()
}

export async function obtenerTiposClienteAction(): Promise<SelectOption[]> {
  const repository = new PrismaSelectOptionsRepository()
  const useCase = new ObtenerTiposClienteUseCase(repository)
  return useCase.execute()
}

export async function obtenerVendedoresAction(): Promise<SelectOption[]> {
  const repository = new PrismaSelectOptionsRepository()
  const useCase = new ObtenerVendedoresUseCase(repository)
  return useCase.execute()
}

export async function obtenerCondicionesPagoAction(): Promise<SelectOption[]> {
  const repository = new PrismaSelectOptionsRepository()
  const useCase = new ObtenerCondicionesPagoUseCase(repository)
  return useCase.execute()
}

export async function obtenerTiposDocumentoAction(): Promise<SelectOption[]> {
  const repository = new PrismaSelectOptionsRepository()
  const useCase = new ObtenerTiposDocumentoUseCase(repository)
  return useCase.execute()
}

export async function obtenerMonedasAction(): Promise<SelectOption[]> {
  const repository = new PrismaSelectOptionsRepository()
  const useCase = new ObtenerMonedasUseCase(repository)
  return useCase.execute()
}

export async function obtenerLineasAction(): Promise<SelectOption[]> {
  const repository = new PrismaSelectOptionsRepository()
  const useCase = new ObtenerLineasUseCase(repository)
  return useCase.execute()
}

export async function obtenerTiposProductoAction(): Promise<SelectOption[]> {
  const repository = new PrismaSelectOptionsRepository()
  const useCase = new ObtenerTiposProductoUseCase(repository)
  return useCase.execute()
}

export async function obtenerProcedenciasAction(): Promise<SelectOption[]> {
  const repository = new PrismaSelectOptionsRepository()
  const useCase = new ObtenerProcedenciasUseCase(repository)
  return useCase.execute()
}

export async function obtenerSubFamiliasAction(): Promise<SelectOption[]> {
  const repository = new PrismaSelectOptionsRepository()
  const useCase = new ObtenerSubFamiliasUseCase(repository)
  return useCase.execute()
}

export async function obtenerUnidadesMedidaAction(): Promise<SelectOption[]> {
  const repository = new PrismaSelectOptionsRepository()
  const useCase = new ObtenerUnidadesMedidaUseCase(repository)
  return useCase.execute()
}

export async function obtenerTiposProveedorAction(): Promise<SelectOption[]> {
  const repository = new PrismaSelectOptionsRepository()
  const useCase = new ObtenerTiposProveedorUseCase(repository)
  return useCase.execute()
}

export async function obtenerSiguienteCodigoProductoAction(abreviatura: string): Promise<string> {
  const repository = new PrismaSelectOptionsRepository()
  const useCase = new ObtenerSiguienteCodigoProductoUseCase(repository)
  return useCase.execute(abreviatura)
}

export async function listarProveedoresSelectAction(): Promise<ProveedorSelectItem[]> {
  const repository = new PrismaProveedorRepository()
  const useCase = new ListarProveedoresSelectUseCase(repository)
  return useCase.execute()
}

export async function buscarProveedoresAction(term: string): Promise<ProveedorSelectItem[]> {
  const repository = new PrismaProveedorRepository()
  const useCase = new BuscarProveedoresUseCase(repository)
  return useCase.execute(term)
}

export async function crearClienteAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await requirePermission('ventas.clientes.crear')

    const session = await getSession()
    if (!session) return { error: 'No se encontró una sesión activa' }

    const rawData = {
      ruc: formData.get('ruc'),
      razonSocial: formData.get('razonSocial'),
      direccion: formData.get('direccion'),
      telefono: formData.get('telefono'),
      fax: formData.get('fax'),
      activo: formData.get('activo') === '1' ? 1 : 0,
      codigoProvincia: formData.get('codigoProvincia'),
      codigoDistrito: formData.get('codigoDistrito'),
      codigoTipoCliente: formData.get('codigoTipoCliente'),
      codigoCondicionPago: formData.get('codigoCondicionPago'),
      codigoVendedor: formData.get('codigoVendedor')
    }

    const parsed = clienteSchema.safeParse(rawData)
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message }
    }

    const data = parsed.data

    const cliente: Cliente = {
      ruc: data.ruc,
      razonSocial: data.razonSocial,
      activo: data.activo,
      direccion: data.direccion,
      provincia: '',
      distrito: '',
      telefono: data.telefono,
      fax: data.fax,
      tipoCliente: '',
      condicionPago: '',
      vendedor: '',
      codigoProvincia: data.codigoProvincia,
      codigoDistrito: data.codigoDistrito,
      codigoTipoCliente: data.codigoTipoCliente,
      codigoCondicionPago: data.codigoCondicionPago,
      codigoVendedor: data.codigoVendedor
    }

    const clienteRepository = new PrismaClienteRepository()
    const useCase = new GuardarClienteUseCase(clienteRepository)

    await useCase.execute(cliente, session.userId)

    await auditService.log(
      session.userId,
      'CREAR_CLIENTE',
      `Cliente creado con RUC: ${cliente.ruc}, Razón Social: ${cliente.razonSocial}`
    )

    revalidatePath('/ventas/cliente')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido al crear cliente' }
  }
}

export async function actualizarClienteAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await requirePermission('ventas.clientes.editar')

    const session = await getSession()
    if (!session) return { error: 'No se encontró una sesión activa' }

    const rawData = {
      ruc: formData.get('ruc'),
      razonSocial: formData.get('razonSocial'),
      direccion: formData.get('direccion'),
      telefono: formData.get('telefono'),
      fax: formData.get('fax'),
      activo: formData.get('activo') === '1' ? 1 : 0,
      codigoProvincia: formData.get('codigoProvincia'),
      codigoDistrito: formData.get('codigoDistrito'),
      codigoTipoCliente: formData.get('codigoTipoCliente'),
      codigoCondicionPago: formData.get('codigoCondicionPago'),
      codigoVendedor: formData.get('codigoVendedor')
    }

    const parsed = clienteSchema.safeParse(rawData)
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message }
    }

    const data = parsed.data

    const cliente: Cliente = {
      ruc: data.ruc,
      razonSocial: data.razonSocial,
      activo: data.activo,
      direccion: data.direccion,
      provincia: '',
      distrito: '',
      telefono: data.telefono,
      fax: data.fax,
      tipoCliente: '',
      condicionPago: '',
      vendedor: '',
      codigoProvincia: data.codigoProvincia,
      codigoDistrito: data.codigoDistrito,
      codigoTipoCliente: data.codigoTipoCliente,
      codigoCondicionPago: data.codigoCondicionPago,
      codigoVendedor: data.codigoVendedor
    }

    const clienteRepository = new PrismaClienteRepository()
    const useCase = new ActualizarClienteUseCase(clienteRepository)

    await useCase.execute(cliente, session.userId)

    await auditService.log(
      session.userId,
      'ACTUALIZAR_CLIENTE',
      `Cliente actualizado con RUC: ${cliente.ruc}, Razón Social: ${cliente.razonSocial}`
    )

    revalidatePath('/ventas/cliente')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido al actualizar cliente' }
  }
}

export async function eliminarClienteAction(
  ruc: string
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await requirePermission('ventas.clientes.eliminar')

    const session = await getSession()
    if (!session) return { error: 'No se encontró una sesión activa' }

    const clienteRepository = new PrismaClienteRepository()
    const useCase = new EliminarClienteUseCase(clienteRepository)

    await useCase.execute(ruc)

    await auditService.log(session.userId, 'ELIMINAR_CLIENTE', `Cliente eliminado con RUC: ${ruc}`)

    revalidatePath('/ventas/cliente')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Error desconocido al eliminar cliente' }
  }
}
