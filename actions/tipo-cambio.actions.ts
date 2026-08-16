'use server'

import { requirePermission } from '@/auth/permissions'
import { getSession } from '@/auth/session'
import { auditService } from '@/core/infrastructure/logging/audit.service'
import { GuardarTipoCambioUseCase } from '@/configuracion/application/use-cases/guardar-tipo-cambio.use-case'
import { ListarHistorialTipoCambioUseCase } from '@/configuracion/application/use-cases/listar-historial-tipo-cambio.use-case'
import { SqlTipoCambioRepository } from '@/configuracion/infrastructure/adapters/sql-tipo-cambio.repository'
import { tipoCambioSchema } from '@/validators/tipo-cambio.schema'

function formatearFecha(fecha: Date): string {
  return fecha.toLocaleDateString('en-CA')
}

export async function obtenerHistorialTipoCambioAction(): Promise<
  { fecha: string; venta: number; compra: number }[]
> {
  const repository = new SqlTipoCambioRepository()
  const useCase = new ListarHistorialTipoCambioUseCase(repository)
  const resultado = await useCase.execute()

  return resultado.map((item) => ({
    fecha: formatearFecha(item.fecha),
    venta: item.venta,
    compra: item.compra
  }))
}

export async function guardarTipoCambioAction(
  _prevState: unknown,
  formData: FormData
): Promise<{ ok?: boolean; error?: string }> {
  try {
    await requirePermission('configuracion.tipo-cambio.guardar')

    const session = await getSession()
    if (!session) return { error: 'No se encontró una sesión activa' }

    const parsed = tipoCambioSchema.safeParse({
      venta: formData.get('venta'),
      compra: formData.get('compra')
    })
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message }
    }

    const repository = new SqlTipoCambioRepository()
    const useCase = new GuardarTipoCambioUseCase(repository)
    await useCase.execute({
      fecha: new Date(),
      venta: parsed.data.venta,
      compra: parsed.data.compra
    })

    await auditService.log(
      session.userId,
      'GUARDAR_TIPO_CAMBIO',
      `Tipo de cambio guardado para ${formatearFecha(new Date())}: venta ${parsed.data.venta}, compra ${parsed.data.compra}`
    )

    return { ok: true }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Error desconocido al guardar tipo de cambio'
    }
  }
}
