import { getDbPool } from '@/core/infrastructure/db/client'
import { CuentaPagarPorRuc, CuentasPagarFiltro } from '@/ventas/domain/entities/cuenta-pagar.entity'
import { CuentaPagarRepository } from '@/ventas/domain/ports/cuenta-pagar-repository.port'

interface CuentaPagarPorRucRow {
  tipoDocumento: string | null
  numDocumento: string | null
  proveedor: string | null
  direccion: string | null
  saldo: number | null
  vencimiento: string | null
}

const globalForCuentaPagar = globalThis as unknown as {
  sqlCuentaPagarRepository: SqlCuentaPagarRepository | undefined
}

export class SqlCuentaPagarRepository implements CuentaPagarRepository {
  async listarPorFiltro(filtro: CuentasPagarFiltro): Promise<CuentaPagarPorRuc[]> {
    const pool = await getDbPool()
    const request = pool.request()
    const conditions: string[] = []

    if (filtro.ruc) {
      conditions.push('M_CTEPRV.RUC_PRV = @ruc')
      request.input('ruc', filtro.ruc)
    }
    if (filtro.tipoDocumento) {
      conditions.push('M_CTEPRV.CDG_TDOC = @tipoDocumento')
      request.input('tipoDocumento', filtro.tipoDocumento)
    }
    if (filtro.numeroDocumento) {
      conditions.push('M_CTEPRV.NUM_DOCU = @numeroDocumento')
      request.input('numeroDocumento', filtro.numeroDocumento)
    }
    if (filtro.fechaDocumento) {
      conditions.push('CONVERT(DATE, M_CTEPRV.FEC_DOCU) = @fechaDocumento')
      request.input('fechaDocumento', filtro.fechaDocumento)
    }
    if (filtro.fechaVencimiento) {
      conditions.push('CONVERT(DATE, M_CTEPRV.VCT_DOCU) = @fechaVencimiento')
      request.input('fechaVencimiento', filtro.fechaVencimiento)
    }
    if (filtro.saldo !== undefined && filtro.saldo !== null) {
      conditions.push('M_CTEPRV.IMP_DOCU = @saldo')
      request.input('saldo', filtro.saldo)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const result = await request.query(`
        SELECT TOP 500
          D_TABLAS.DES_ITEM              AS tipoDocumento,
          M_CTEPRV.NUM_DOCU              AS numDocumento,
          LTRIM(RTRIM(M_PROVEE.DES_PRV))   AS proveedor,
          LTRIM(RTRIM(M_PROVEE.DIR_PRV))   AS direccion,
          M_CTEPRV.IMP_DOCU              AS saldo,
          CONVERT(VARCHAR(10), M_CTEPRV.VCT_DOCU, 103) AS vencimiento
        FROM M_CTEPRV
        INNER JOIN M_PROVEE ON M_PROVEE.RUC_PRV = M_CTEPRV.RUC_PRV
        INNER JOIN D_TABLAS
          ON D_TABLAS.CDG_TAB = 'TDC'
         AND D_TABLAS.NUM_ITEM = M_CTEPRV.CDG_TDOC
        ${where}
        ORDER BY M_CTEPRV.VCT_DOCU DESC
      `)

    const rows = result.recordset as CuentaPagarPorRucRow[]
    return rows.map((r) => ({
      tipoDocumento: r.tipoDocumento ?? '',
      numDocumento: r.numDocumento ?? '',
      proveedor: r.proveedor ?? '',
      direccion: r.direccion ?? '',
      saldo: r.saldo ?? 0,
      vencimiento: r.vencimiento ?? ''
    }))
  }
}

export const sqlCuentaPagarRepository =
  globalForCuentaPagar.sqlCuentaPagarRepository ?? new SqlCuentaPagarRepository()

if (process.env.NODE_ENV !== 'production') {
  globalForCuentaPagar.sqlCuentaPagarRepository = sqlCuentaPagarRepository
}
