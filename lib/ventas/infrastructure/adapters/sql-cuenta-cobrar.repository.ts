import { getDbPool } from '@/core/infrastructure/db/client'
import type {
  CuentaCobrar,
  CuentaCobrarPorRuc,
  CuentasCobrarFiltro
} from '@/ventas/domain/entities/cuenta-cobrar.entity'
import type { CuentaCobrarRepository } from '@/ventas/domain/ports/cuenta-cobrar-repository.port'

interface CuentaCobrarPorRucRow {
  tipoDocumento: string | null
  numDocumento: string | null
  cliente: string | null
  direccion: string | null
  saldo: number | null
  vencimiento: string | null
}

const globalForCuentaCobrar = globalThis as unknown as {
  sqlCuentaCobrarRepository: SqlCuentaCobrarRepository | undefined
}

export class SqlCuentaCobrarRepository implements CuentaCobrarRepository {
  /** Lista todas las cuentas por cobrar pendientes desde SQL Server */
  async listar(): Promise<CuentaCobrar[]> {
    const pool = await getDbPool()
    const result = await pool.request().query(`
      SELECT TOP 500
        c.CDG_TDOC AS tipoDocumento,
        c.NUM_DOCU AS numeroDocumento,
        c.RUC_CLI AS rucCliente,
        cl.DES_CLI AS nombreCliente,
        cl.DIR_CLI AS direccionCliente,
        c.CDG_MON AS moneda,
        CONVERT(VARCHAR(10), c.FEC_DOCU, 103) AS fechaDocumento,
        CONVERT(VARCHAR(10), c.VCT_DOCU, 103) AS fechaVencimiento,
        c.IMP_DOCU AS importeDocumento,
        c.PAG_DOCU AS importePagado,
        c.IMP_DOCU AS saldo,
        CASE
          WHEN c.SWT_DOCU = '1' THEN 'Pendiente'
          WHEN c.SWT_DOCU = '2' THEN 'En Proceso'
          WHEN c.SWT_DOCU = '3' THEN 'Cancelado'
          ELSE 'Desconocido'
        END AS estado
      FROM M_CTECLI c
      INNER JOIN M_CLIENT cl ON c.RUC_CLI = cl.RUC_CLI
      WHERE c.SWT_DOCU <> '3'
      ORDER BY c.FEC_DOCU DESC
    `)

    return result.recordset as CuentaCobrar[]
  }

  async listarPorFiltro(filtro: CuentasCobrarFiltro): Promise<CuentaCobrarPorRuc[]> {
    const pool = await getDbPool()
    const request = pool.request()
    const conditions: string[] = []

    if (filtro.ruc) {
      conditions.push('M_CTECLI.RUC_CLI = @ruc')
      request.input('ruc', filtro.ruc)
    }
    if (filtro.tipoDocumento) {
      conditions.push('M_CTECLI.CDG_TDOC = @tipoDocumento')
      request.input('tipoDocumento', filtro.tipoDocumento)
    }
    if (filtro.numeroDocumento) {
      conditions.push('M_CTECLI.NUM_DOCU LIKE @numeroDocumento')
      request.input('numeroDocumento', filtro.numeroDocumento)
    }
    if (filtro.fechaDocumento) {
      conditions.push('CONVERT(DATE, M_CTECLI.FEC_DOCU) = @fechaDocumento')
      request.input('fechaDocumento', filtro.fechaDocumento)
    }
    if (filtro.fechaVencimiento) {
      conditions.push('CONVERT(DATE, M_CTECLI.VCT_DOCU) = @fechaVencimiento')
      request.input('fechaVencimiento', filtro.fechaVencimiento)
    }
    if (filtro.saldo !== undefined && filtro.saldo !== null) {
      conditions.push('M_CTECLI.IMP_DOCU = @saldo')
      request.input('saldo', filtro.saldo)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const result = await request.query(`
        SELECT TOP 500
          D_TABLAS.DES_ITEM              AS tipoDocumento,
          M_CTECLI.NUM_DOCU              AS numDocumento,
          LTRIM(RTRIM(M_CLIENT.DES_CLI)) AS cliente,
          LTRIM(RTRIM(M_CLIENT.DIR_CLI)) AS direccion,
          M_CTECLI.IMP_DOCU              AS saldo,
          CONVERT(VARCHAR(10), M_CTECLI.VCT_DOCU, 103) AS vencimiento
        FROM M_CTECLI
        INNER JOIN M_CLIENT ON M_CLIENT.RUC_CLI = M_CTECLI.RUC_CLI
        INNER JOIN D_TABLAS
          ON D_TABLAS.CDG_TAB = 'TDC'
         AND D_TABLAS.NUM_ITEM = M_CTECLI.CDG_TDOC
        ${where}
        ORDER BY M_CTECLI.VCT_DOCU DESC
      `)

    const rows = result.recordset as CuentaCobrarPorRucRow[]
    return rows.map((r) => ({
      tipoDocumento: r.tipoDocumento ?? '',
      numDocumento: r.numDocumento ?? '',
      cliente: r.cliente ?? '',
      direccion: r.direccion ?? '',
      saldo: r.saldo ?? 0,
      vencimiento: r.vencimiento ?? ''
    }))
  }
}

export const sqlCuentaCobrarRepository =
  globalForCuentaCobrar.sqlCuentaCobrarRepository ?? new SqlCuentaCobrarRepository()

if (process.env.NODE_ENV !== 'production') {
  globalForCuentaCobrar.sqlCuentaCobrarRepository = sqlCuentaCobrarRepository
}
