import { prisma } from '@/core/infrastructure/prisma/client'
import { Cliente, ClienteSelectItem } from '@/ventas/domain/entities/cliente.entity'
import { ClienteRepository } from '@/ventas/domain/ports/cliente-repository.port'
import { Prisma } from '@prisma/client'

export class PrismaClienteRepository implements ClienteRepository {
  async obtenerTodos(): Promise<Cliente[]> {
    const result = await prisma.$queryRaw<Cliente[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(MC.RUC_CLI)) as ruc,
        LTRIM(RTRIM(MC.DES_CLI)) as razonSocial,
        CAST(MC.SWT_CLI AS INT) as activo,
        LTRIM(RTRIM(MC.DIR_CLI)) as direccion,
        LTRIM(RTRIM(TBP.DES_ITEM)) as provincia,
        LTRIM(RTRIM(TBD.DES_ITEM)) as distrito,
        LTRIM(RTRIM(MC.TEL_CLI)) as telefono,
        LTRIM(RTRIM(MC.FAX_CLI)) as fax,
        LTRIM(RTRIM(TBT.DES_ITEM)) as tipoCliente,
        LTRIM(RTRIM(TBC.DES_ITEM)) as condicionPago,
        LTRIM(RTRIM(vendedor.des_vend)) as vendedor,
        LTRIM(RTRIM(MC.REF1)) as codigoProvincia,
        LTRIM(RTRIM(MC.CDG_UDIS)) as codigoDistrito,
        LTRIM(RTRIM(MC.CDG_TCLI)) as codigoTipoCliente,
        LTRIM(RTRIM(MC.CDG_CPAG)) as codigoCondicionPago,
        LTRIM(RTRIM(MC.CDG_VEND)) as codigoVendedor
      FROM
        M_CLIENT as MC
        LEFT JOIN D_TABLAS as TBP on TBP.cdg_tab = 'LUG'
          and TBP.swt_item = 1
          and MC.REF1 = TBP.NUM_ITEM
        LEFT JOIN D_TABLAS as TBD on TBD.cdg_tab = 'DST'
          and TBD.swt_item = 1
          and MC.CDG_UDIS = TBD.NUM_ITEM
        LEFT JOIN D_TABLAS as TBT on TBT.cdg_tab = 'TCL'
          and TBT.swt_item = 1
          and MC.CDG_TCLI = TBT.NUM_ITEM
        LEFT JOIN M_VENDED as vendedor on vendedor.cdg_vend = MC.CDG_VEND
        LEFT JOIN D_TABLAS as TBC on TBC.cdg_tab = 'CPG'
          and TBC.swt_item = 1
          and MC.CDG_CPAG = TBC.NUM_ITEM
      WHERE
        MC.SWT_CLI = 1
    `)

    return result
  }

  async obtenerPorRuc(ruc: string): Promise<Cliente | null> {
    const result = await prisma.$queryRaw<Cliente[]>`
      SELECT TOP 1
        LTRIM(RTRIM(MC.RUC_CLI)) as ruc,
        LTRIM(RTRIM(MC.DES_CLI)) as razonSocial,
        CAST(MC.SWT_CLI AS INT) as activo,
        LTRIM(RTRIM(MC.DIR_CLI)) as direccion,
        LTRIM(RTRIM(TBP.DES_ITEM)) as provincia,
        LTRIM(RTRIM(TBD.DES_ITEM)) as distrito,
        LTRIM(RTRIM(MC.TEL_CLI)) as telefono,
        LTRIM(RTRIM(MC.FAX_CLI)) as fax,
        LTRIM(RTRIM(TBT.DES_ITEM)) as tipoCliente,
        LTRIM(RTRIM(TBC.DES_ITEM)) as condicionPago,
        LTRIM(RTRIM(vendedor.des_vend)) as vendedor,
        LTRIM(RTRIM(MC.REF1)) as codigoProvincia,
        LTRIM(RTRIM(MC.CDG_UDIS)) as codigoDistrito,
        LTRIM(RTRIM(MC.CDG_TCLI)) as codigoTipoCliente,
        LTRIM(RTRIM(MC.CDG_CPAG)) as codigoCondicionPago,
        LTRIM(RTRIM(MC.CDG_VEND)) as codigoVendedor
      FROM
        M_CLIENT as MC
        LEFT JOIN D_TABLAS as TBP on TBP.cdg_tab = 'LUG'
          and TBP.swt_item = 1
          and MC.REF1 = TBP.NUM_ITEM
        LEFT JOIN D_TABLAS as TBD on TBD.cdg_tab = 'DST'
          and TBD.swt_item = 1
          and MC.CDG_UDIS = TBD.NUM_ITEM
        LEFT JOIN D_TABLAS as TBT on TBT.cdg_tab = 'TCL'
          and TBT.swt_item = 1
          and MC.CDG_TCLI = TBT.NUM_ITEM
        LEFT JOIN M_VENDED as vendedor on vendedor.cdg_vend = MC.CDG_VEND
        LEFT JOIN D_TABLAS as TBC on TBC.cdg_tab = 'CPG'
          and TBC.swt_item = 1
          and MC.CDG_CPAG = TBC.NUM_ITEM
      WHERE
        MC.RUC_CLI = ${ruc}
        AND MC.SWT_CLI = 1
    `

    if (result.length === 0) return null
    return result[0]
  }

  async listarParaSelect(): Promise<ClienteSelectItem[]> {
    const result = await prisma.$queryRaw<ClienteSelectItem[]>`
      SELECT TOP 500
        LTRIM(RTRIM(RUC_CLI)) as ruc,
        LTRIM(RTRIM(DES_CLI)) as nombre,
        LTRIM(RTRIM(DIR_CLI)) as direccion
      FROM M_CLIENT
      WHERE SWT_CLI = 1
      ORDER BY DES_CLI
    `
    return result
  }

  async buscar(term: string): Promise<ClienteSelectItem[]> {
    const like = `%${term}%`
    const result = await prisma.$queryRaw<ClienteSelectItem[]>`
      SELECT TOP 50
        LTRIM(RTRIM(RUC_CLI)) as ruc,
        LTRIM(RTRIM(DES_CLI)) as nombre,
        LTRIM(RTRIM(DIR_CLI)) as direccion
      FROM M_CLIENT
      WHERE SWT_CLI = 1
        AND (RUC_CLI LIKE ${like} OR DES_CLI LIKE ${like} OR DIR_CLI LIKE ${like})
      ORDER BY DES_CLI
    `
    return result
  }

  async guardar(cliente: Cliente, usuarioCdg: string): Promise<void> {
    const now = new Date()
    const horUsu = now.toTimeString().split(' ')[0]

    await prisma.$executeRaw`
      INSERT INTO M_CLIENT (
        RUC_CLI, DES_CLI, DIR_CLI, TEL_CLI, FAX_CLI,
        EMA_CLI, REP_CLI, CDG_TCLI, CDG_VEND, CDG_UDIS,
        SWT_CLI, CDG_CPAG, REF1, cdg_usu, fec_usu, hor_usu, ema_1, ema_2
      ) VALUES (
        ${cliente.ruc}, 
        ${cliente.razonSocial}, 
        ${cliente.direccion || ''}, 
        ${cliente.telefono || ''}, 
        ${cliente.fax || ''},
        '', 
        '', 
        ${cliente.codigoTipoCliente || null}, 
        ${cliente.codigoVendedor || null}, 
        ${cliente.codigoDistrito || null},
        ${cliente.activo}, 
        ${cliente.codigoCondicionPago || null}, 
        ${cliente.codigoProvincia || null}, 
        ${usuarioCdg}, 
        ${now}, 
        ${horUsu}, 
        '', 
        ''
      )
    `
  }

  async actualizar(cliente: Cliente, usuarioCdg: string): Promise<void> {
    await prisma.$executeRaw`
      UPDATE M_CLIENT
      SET
        DES_CLI = ${cliente.razonSocial},
        DIR_CLI = ${cliente.direccion || ''},
        TEL_CLI = ${cliente.telefono || ''},
        FAX_CLI = ${cliente.fax || ''},
        CDG_TCLI = ${cliente.codigoTipoCliente || null},
        CDG_VEND = ${cliente.codigoVendedor || null},
        CDG_UDIS = ${cliente.codigoDistrito || null},
        SWT_CLI = ${cliente.activo},
        CDG_CPAG = ${cliente.codigoCondicionPago || null},
        REF1 = ${cliente.codigoProvincia || null},
        cdg_usu = ${usuarioCdg},
        fec_usu = GETDATE()
      WHERE
        RUC_CLI = ${cliente.ruc}
    `
  }

  async eliminar(ruc: string): Promise<void> {
    await prisma.$executeRaw`
      UPDATE M_CLIENT
      SET SWT_CLI = 0
      WHERE RUC_CLI = ${ruc}
    `
  }
}

export const prismaClienteRepository = new PrismaClienteRepository()
