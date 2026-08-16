import { TipoCambio } from '@/configuracion/domain/entities/tipo-cambio.entity'
import { TipoCambioRepository } from '@/configuracion/domain/ports/tipo-cambio-repository.port'
import { prisma } from '@/core/infrastructure/prisma/client'

type TipoCambioRow = {
  FEC_CMB: Date
  TIP_CMB: number
  TIP_CMBC: number
}

export class SqlTipoCambioRepository implements TipoCambioRepository {
  /**
   * Lista todos los tipos de cambio registrados ordenados por fecha descendente.
   */
  async listarHistorial(): Promise<TipoCambio[]> {
    const rows = await prisma.$queryRaw<TipoCambioRow[]>`
      SELECT TOP 500 FEC_CMB, TIP_CMB, TIP_CMBC
      FROM T_CAMBIO
      ORDER BY FEC_CMB DESC
    `

    return rows.map((row) => ({
      fecha: row.FEC_CMB,
      venta: Number(row.TIP_CMB),
      compra: Number(row.TIP_CMBC)
    }))
  }

  /**
   * Inserta un nuevo tipo de cambio usando la fecha/hora exacta del servidor.
   * La tabla no tiene clave única en fecha, por lo que se permiten múltiples
   * registros para la misma fecha.
   */
  async guardar(tipoCambio: TipoCambio): Promise<void> {
    await prisma.$executeRaw`
      INSERT INTO T_CAMBIO (FEC_CMB, TIP_CMB, TIP_CMBC)
      VALUES (GETDATE(), ${tipoCambio.venta}, ${tipoCambio.compra})
    `
  }
}
