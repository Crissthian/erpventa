import { prisma } from '@/core/infrastructure/prisma/client'
import { SelectOption } from '@/ventas/domain/entities/select-option.entity'
import { SelectOptionsRepository } from '@/ventas/domain/ports/select-options-repository.port'
import { Prisma } from '@prisma/client'

interface RawSelectOption {
  codigo: string
  descripcion: string
  abreviatura?: string
}

export class PrismaSelectOptionsRepository implements SelectOptionsRepository {
  async obtenerProvincias(): Promise<SelectOption[]> {
    const result = await prisma.$queryRaw<RawSelectOption[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(num_item)) as codigo,
        LTRIM(RTRIM(des_item)) as descripcion
      FROM d_tablas
      WHERE cdg_tab = 'LUG'
        AND swt_item = 1
      ORDER BY des_item
    `)
    return result
  }

  async obtenerDistritos(): Promise<SelectOption[]> {
    const result = await prisma.$queryRaw<RawSelectOption[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(num_item)) as codigo,
        LTRIM(RTRIM(des_item)) as descripcion
      FROM d_tablas
      WHERE cdg_tab = 'DST'
        AND swt_item = 1
      ORDER BY des_item
    `)
    return result
  }

  async obtenerTiposCliente(): Promise<SelectOption[]> {
    const result = await prisma.$queryRaw<RawSelectOption[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(num_item)) as codigo,
        LTRIM(RTRIM(des_item)) as descripcion
      FROM d_tablas
      WHERE cdg_tab = 'TCL'
        AND swt_item = 1
      ORDER BY des_item
    `)
    return result
  }

  async obtenerVendedores(): Promise<SelectOption[]> {
    const result = await prisma.$queryRaw<RawSelectOption[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(cdg_vend)) as codigo,
        LTRIM(RTRIM(des_vend)) as descripcion
      FROM m_vended
      ORDER BY des_vend
    `)
    return result
  }

  async obtenerCondicionesPago(): Promise<SelectOption[]> {
    const result = await prisma.$queryRaw<RawSelectOption[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(num_item)) as codigo,
        LTRIM(RTRIM(des_item)) as descripcion
      FROM d_tablas
      WHERE cdg_tab = 'CPG'
      ORDER BY des_item
    `)
    return result
  }

  async obtenerTiposDocumento(): Promise<SelectOption[]> {
    const result = await prisma.$queryRaw<RawSelectOption[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(NUM_ITEM)) as codigo,
        LTRIM(RTRIM(DES_ITEM)) as descripcion
      FROM D_TABLAS
      WHERE CDG_TAB = 'TDC'
      ORDER BY DES_ITEM
    `)
    return result
  }

  async obtenerMonedas(): Promise<SelectOption[]> {
    const result = await prisma.$queryRaw<RawSelectOption[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(NUM_ITEM)) as codigo,
        LTRIM(RTRIM(DES_ITEM)) as descripcion
      FROM D_TABLAS
      WHERE CDG_TAB = 'MON'
      ORDER BY DES_ITEM
    `)
    return result
  }

  async obtenerLineas(): Promise<SelectOption[]> {
    const result = await prisma.$queryRaw<RawSelectOption[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(num_item)) as codigo,
        LTRIM(RTRIM(des_item)) as descripcion,
        LTRIM(RTRIM(abr_item)) as abreviatura
      FROM d_tablas
      WHERE cdg_tab = 'LIN'
        AND swt_item = 1
      ORDER BY des_item
    `)
    return result
  }

  async obtenerTiposProducto(): Promise<SelectOption[]> {
    const result = await prisma.$queryRaw<RawSelectOption[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(num_item)) as codigo,
        LTRIM(RTRIM(des_item)) as descripcion
      FROM d_tablas
      WHERE cdg_tab = 'TPR'
        AND swt_item = 1
      ORDER BY des_item
    `)
    return result
  }

  async obtenerProcedencias(): Promise<SelectOption[]> {
    const result = await prisma.$queryRaw<RawSelectOption[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(num_item)) as codigo,
        LTRIM(RTRIM(des_item)) as descripcion
      FROM d_tablas
      WHERE cdg_tab = 'CLA'
        AND swt_item = 1
      ORDER BY des_item
    `)
    return result
  }

  async obtenerSubFamilias(): Promise<SelectOption[]> {
    const result = await prisma.$queryRaw<RawSelectOption[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(num_item)) as codigo,
        LTRIM(RTRIM(des_item)) as descripcion
      FROM d_tablas
      WHERE cdg_tab = 'COL'
        AND swt_item = 1
      ORDER BY des_item
    `)
    return result
  }

  async obtenerUnidadesMedida(): Promise<SelectOption[]> {
    const result = await prisma.$queryRaw<RawSelectOption[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(num_item)) as codigo,
        LTRIM(RTRIM(des_item)) as descripcion
      FROM d_tablas
      WHERE cdg_tab = 'UNM'
        AND swt_item = 1
      ORDER BY des_item
    `)
    return result
  }

  async obtenerSiguienteCodigoProducto(abreviatura: string): Promise<string> {
    if (!abreviatura || abreviatura.trim() === '') {
      throw new Error('La abreviatura de la línea no puede estar vacía.')
    }

    const lineExists = await prisma.$queryRaw<unknown[]>(Prisma.sql`
      SELECT 1
      FROM d_tablas
      WHERE cdg_tab = 'LIN'
        AND swt_item = 1
        AND LTRIM(RTRIM(abr_item)) = ${abreviatura}
    `)

    if (lineExists.length === 0) {
      throw new Error(
        `La línea con abreviatura '${abreviatura}' no es válida o no está activa en la base de datos.`
      )
    }

    const result = await prisma.$queryRawUnsafe<{ maxCode: string | null }[]>(`
      SELECT MAX(LTRIM(RTRIM(CDG_PROD))) as maxCode
      FROM M_PRODUC
      WHERE CDG_PROD LIKE '${abreviatura}%'
    `)

    const maxCode = result[0]?.maxCode

    if (maxCode) {
      const numPart = maxCode.substring(abreviatura.length)
      const num = parseInt(numPart, 10)
      const nextNum = isNaN(num) ? 1 : num + 1
      return abreviatura + String(nextNum).padStart(5, '0')
    }

    return abreviatura + '00001'
  }

  async obtenerTiposProveedor(): Promise<SelectOption[]> {
    const result = await prisma.$queryRaw<RawSelectOption[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(num_item)) as codigo,
        LTRIM(RTRIM(des_item)) as descripcion
      FROM d_tablas
      WHERE cdg_tab = 'PRV'
        AND swt_item = 1
      ORDER BY des_item
    `)
    return result
  }
}
