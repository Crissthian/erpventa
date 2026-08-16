import { Prisma } from '@prisma/client'
import { prisma } from '@/core/infrastructure/prisma/client'
import { Producto } from '@/inventario/domain/entities/producto.entity'
import { ProductoRepository, ProductoRow } from '@/inventario/domain/ports/producto-repository.port'

/**
 * Adaptador de Infraestructura: SqlProductoRepository
 * Implementa el puerto ProductoRepository usando SQL Server sin ORM.
 */
interface RawProductoRow {
  codigo: string
  linea: string | null
  activo: number | null
  cEquivalente: string | null
  codBarra: string | null
  abreviatura: string | null
  descripcion: string
  afecto: number | null
  volumen: number | null
  peso: number | null
  destVenta: number | null
  destCompra: number | null
  tipo: string | null
  procedencia: string | null
  subFamilia: string | null
  undMedida: string | null
  valorSoles: number | null
  valorDolares: number | null
  stock: number | null
  usuarioModificacion: string | null
  fechaModificacion: Date | null
  horaModificacion: string | null
}

export class SqlProductoRepository implements ProductoRepository {
  async crear(producto: Producto): Promise<Producto> {
    const now = new Date()
    const hora = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(' ', '')
    const fecha = now

    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO M_PRODUC (
        CDG_PROD, CDG_LINP, CDG_COLP, CDG_CLAP, CDG_TPRD, CDG_UMED,
        DES_PROD, ABR_PROD, VAL_SOL, VAL_DOL, STK_MAX, STK_MIN,
        SWT_PROD, SWT_IGV, SWT_CMP, SWT_VTA, PESO, VOLUMEN,
        CDG_EQV, CDG_BAR, REF1, cdg_usu, fec_usu, hor_usu
      ) VALUES (
        ${producto.codigo.trim()},
        ${producto.linea || null},
        ${producto.subFamilia || null},
        ${producto.procedencia || null},
        ${producto.tipo || null},
        ${producto.undMedida || null},
        ${producto.descripcion.trim().toUpperCase()},
        ${producto.abreviatura || null},
        ${producto.valorSoles},
        ${producto.valorDolares},
        0, 0,
        ${producto.activo ? 1 : 0},
        ${producto.afecto ? 1 : 0},
        ${producto.destCompra ? 1 : 0},
        ${producto.destVenta ? 1 : 0},
        ${producto.peso},
        ${producto.volumen},
        ${producto.cEquivalente || null},
        ${producto.codBarra || null},
        '',
        ${producto.usuarioModificacion || 'SUPERVISOR'},
        ${fecha},
        ${hora}
      )
    `)
    return producto
  }

  async actualizar(producto: Producto): Promise<Producto> {
    const now = new Date()
    const hora = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(' ', '')
    const fecha = now

    await prisma.$executeRaw(Prisma.sql`
      UPDATE M_PRODUC
      SET
        CDG_LINP = ${producto.linea || null},
        CDG_COLP = ${producto.subFamilia || null},
        CDG_CLAP = ${producto.procedencia || null},
        CDG_TPRD = ${producto.tipo || null},
        CDG_UMED = ${producto.undMedida || null},
        DES_PROD = ${producto.descripcion.trim().toUpperCase()},
        ABR_PROD = ${producto.abreviatura || null},
        VAL_SOL = ${producto.valorSoles},
        VAL_DOL = ${producto.valorDolares},
        SWT_PROD = ${producto.activo ? 1 : 0},
        SWT_IGV = ${producto.afecto ? 1 : 0},
        SWT_CMP = ${producto.destCompra ? 1 : 0},
        SWT_VTA = ${producto.destVenta ? 1 : 0},
        PESO = ${producto.peso},
        VOLUMEN = ${producto.volumen},
        CDG_EQV = ${producto.cEquivalente || null},
        CDG_BAR = ${producto.codBarra || null},
        cdg_usu = ${producto.usuarioModificacion || 'SUPERVISOR'},
        fec_usu = ${fecha},
        hor_usu = ${hora}
      WHERE CDG_PROD = ${producto.codigo.trim()}
    `)
    return producto
  }

  async eliminar(codigo: string): Promise<void> {
    await prisma.$executeRaw(Prisma.sql`
      DELETE FROM M_PRODUC
      WHERE CDG_PROD = ${codigo.trim()}
    `)
  }

  async obtenerPorId(id: string): Promise<Producto | null> {
    return this.obtenerPorCodigo(id)
  }

  async obtenerPorCodigo(codigo: string): Promise<Producto | null> {
    const result = await prisma.$queryRaw<RawProductoRow[]>(Prisma.sql`
      SELECT
        LTRIM(RTRIM(CDG_PROD)) as codigo,
        LTRIM(RTRIM(CDG_LINP)) as linea,
        COALESCE(SWT_PROD, 0) as activo,
        LTRIM(RTRIM(CDG_EQV)) as cEquivalente,
        LTRIM(RTRIM(CDG_BAR)) as codBarra,
        LTRIM(RTRIM(ABR_PROD)) as abreviatura,
        LTRIM(RTRIM(DES_PROD)) as descripcion,
        COALESCE(SWT_IGV, 0) as afecto,
        COALESCE(VOLUMEN, 0) as volumen,
        COALESCE(PESO, 0) as peso,
        COALESCE(SWT_VTA, 0) as destVenta,
        COALESCE(SWT_CMP, 0) as destCompra,
        LTRIM(RTRIM(CDG_TPRD)) as tipo,
        LTRIM(RTRIM(CDG_CLAP)) as procedencia,
        LTRIM(RTRIM(CDG_COLP)) as subFamilia,
        LTRIM(RTRIM(CDG_UMED)) as undMedida,
        COALESCE(VAL_SOL, 0) as valorSoles,
        COALESCE(VAL_DOL, 0) as valorDolares,
        COALESCE(STK_MAX, 0) as stock,
        LTRIM(RTRIM(cdg_usu)) as usuarioModificacion,
        fec_usu as fechaModificacion,
        LTRIM(RTRIM(hor_usu)) as horaModificacion
      FROM M_PRODUC
      WHERE CDG_PROD = ${codigo.trim()}
    `)

    if (result.length === 0) return null
    const row = result[0]
    return {
      codigo: row.codigo,
      linea: row.linea || '',
      activo: Number(row.activo) === 1,
      cEquivalente: row.cEquivalente || '',
      codBarra: row.codBarra || '',
      abreviatura: row.abreviatura || '',
      descripcion: row.descripcion || '',
      nombre: row.descripcion || '',
      stock: Number(row.stock || 0),
      afecto: Number(row.afecto) === 1,
      volumen: Number(row.volumen),
      peso: Number(row.peso),
      destVenta: Number(row.destVenta) === 1,
      destCompra: Number(row.destCompra) === 1,
      tipo: row.tipo || '',
      procedencia: row.procedencia || '',
      subFamilia: row.subFamilia || '',
      undMedida: row.undMedida || '',
      valorSoles: Number(row.valorSoles),
      valorDolares: Number(row.valorDolares),
      usuarioModificacion: row.usuarioModificacion || '',
      fechaModificacion: row.fechaModificacion ? new Date(row.fechaModificacion) : undefined,
      horaModificacion: row.horaModificacion || ''
    }
  }

  async actualizarStock(id: string, nuevoStock: number): Promise<void> {
    await prisma.$executeRaw(Prisma.sql`
      UPDATE M_PRODUC
      SET STK_MAX = ${nuevoStock}
      WHERE CDG_PROD = ${id.trim()}
    `)
  }

  async listar(): Promise<Producto[]> {
    const result = await prisma.$queryRaw<RawProductoRow[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(CDG_PROD)) as codigo,
        LTRIM(RTRIM(CDG_LINP)) as linea,
        COALESCE(SWT_PROD, 0) as activo,
        LTRIM(RTRIM(CDG_EQV)) as cEquivalente,
        LTRIM(RTRIM(CDG_BAR)) as codBarra,
        LTRIM(RTRIM(ABR_PROD)) as abreviatura,
        LTRIM(RTRIM(DES_PROD)) as descripcion,
        COALESCE(SWT_IGV, 0) as afecto,
        COALESCE(VOLUMEN, 0) as volumen,
        COALESCE(PESO, 0) as peso,
        COALESCE(SWT_VTA, 0) as destVenta,
        COALESCE(SWT_CMP, 0) as destCompra,
        LTRIM(RTRIM(CDG_TPRD)) as tipo,
        LTRIM(RTRIM(CDG_CLAP)) as procedencia,
        LTRIM(RTRIM(CDG_COLP)) as subFamilia,
        LTRIM(RTRIM(CDG_UMED)) as undMedida,
        COALESCE(VAL_SOL, 0) as valorSoles,
        COALESCE(VAL_DOL, 0) as valorDolares,
        COALESCE(STK_MAX, 0) as stock,
        LTRIM(RTRIM(cdg_usu)) as usuarioModificacion,
        fec_usu as fechaModificacion,
        LTRIM(RTRIM(hor_usu)) as horaModificacion
      FROM M_PRODUC
      ORDER BY CDG_PROD ASC
    `)

    return result.map(row => ({
      codigo: row.codigo,
      linea: row.linea || '',
      activo: Number(row.activo) === 1,
      cEquivalente: row.cEquivalente || '',
      codBarra: row.codBarra || '',
      abreviatura: row.abreviatura || '',
      descripcion: row.descripcion || '',
      nombre: row.descripcion || '',
      stock: Number(row.stock || 0),
      afecto: Number(row.afecto) === 1,
      volumen: Number(row.volumen),
      peso: Number(row.peso),
      destVenta: Number(row.destVenta) === 1,
      destCompra: Number(row.destCompra) === 1,
      tipo: row.tipo || '',
      procedencia: row.procedencia || '',
      subFamilia: row.subFamilia || '',
      undMedida: row.undMedida || '',
      valorSoles: Number(row.valorSoles),
      valorDolares: Number(row.valorDolares),
      usuarioModificacion: row.usuarioModificacion || '',
      fechaModificacion: row.fechaModificacion ? new Date(row.fechaModificacion) : undefined,
      horaModificacion: row.horaModificacion || ''
    }))
  }

  async listarConLinea(): Promise<ProductoRow[]> {
    const result = await prisma.$queryRaw<ProductoRow[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(p.CDG_PROD)) as codigo,
        LTRIM(RTRIM(p.DES_PROD)) as descripcion,
        LTRIM(RTRIM(t.DES_ITEM)) as linea
      FROM M_PRODUC p
      LEFT JOIN D_TABLAS t ON t.CDG_TAB = 'LIN' AND t.NUM_ITEM = p.CDG_LINP
      ORDER BY p.fec_usu DESC
    `)
    return result
  }
}
