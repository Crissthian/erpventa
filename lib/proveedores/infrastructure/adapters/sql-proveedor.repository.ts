// lib/proveedores/infrastructure/adapters/sql-proveedor.repository.ts

import { Prisma } from '@prisma/client'
import { prisma } from '@/core/infrastructure/prisma/client'
import { Proveedor } from '@/proveedores/domain/entities/proveedor.entity'
import { ProveedorRepository, ProveedorRow } from '@/proveedores/domain/ports/proveedor-repository.port'

interface RawProveedor {
  ruc: string
  razonSocial: string
  direccion: string
  telefono: string | null
  fax: string | null
  correo: string | null
  observaciones: string | null
  distrito: string | null
  inactivo: number | null
  retencion: number | null
  exterior: number | null
  nombreProveedor: string | null
  apellidoPaterno: string | null
  apellidoMaterno: string | null
  detraccion: number | null
  tipoDocumento: string | null
  tipoProveedor: string | null
  percepcion: number | null
  usuarioModificacion: string | null
  fechaModificacion: Date | null
  horaModificacion: string | null
}

export class SqlProveedorRepository implements ProveedorRepository {
  async crear(proveedor: Proveedor): Promise<Proveedor> {
    const now = new Date()
    const hora = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(' ', '')
    const fecha = now

    // SWT_PRV = 0 si inactivo es true, 1 si inactivo es false (activo)
    const swtPrv = proveedor.inactivo ? 0 : 1

    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO M_PROVEE (
        RUC_PRV, DES_PRV, DIR_PRV, TEL_PRV, FAX_PRV, CON_PRV, OBS_PRV,
        CDG_UDIS, SWT_PRV, SWT_DECL, SWT_EXT, NOM_PRV, APE_PAT, APE_MAT,
        SWT_DETR, CDG_TDOC, CDG_TPRV, SWT_PERC, cdg_usu, fec_usu, hor_usu
      ) VALUES (
        ${proveedor.ruc.trim()},
        ${proveedor.razonSocial.trim().toUpperCase()},
        ${proveedor.direccion.trim().toUpperCase()},
        ${proveedor.telefono || ''},
        ${proveedor.fax || ''},
        ${proveedor.correo || ''},
        ${proveedor.observaciones || ''},
        ${proveedor.distrito || ''},
        ${swtPrv},
        ${proveedor.retencion ? 1 : 0},
        ${proveedor.exterior ? 1 : 0},
        ${(proveedor.nombreProveedor || '').trim().toUpperCase()},
        ${(proveedor.apellidoPaterno || '').trim().toUpperCase()},
        ${(proveedor.apellidoMaterno || '').trim().toUpperCase()},
        ${proveedor.detraccion ? 1 : 0},
        ${proveedor.tipoDocumento || ''},
        ${proveedor.tipoProveedor || ''},
        ${proveedor.percepcion ? 1 : 0},
        ${proveedor.usuarioModificacion || 'SUPERVISOR'},
        ${fecha},
        ${hora}
      )
    `)

    return proveedor
  }

  async actualizar(proveedor: Proveedor): Promise<Proveedor> {
    const now = new Date()
    const hora = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).replace(' ', '')
    const fecha = now
    const swtPrv = proveedor.inactivo ? 0 : 1

    await prisma.$executeRaw(Prisma.sql`
      UPDATE M_PROVEE
      SET
        DES_PRV = ${proveedor.razonSocial.trim().toUpperCase()},
        DIR_PRV = ${proveedor.direccion.trim().toUpperCase()},
        TEL_PRV = ${proveedor.telefono || ''},
        FAX_PRV = ${proveedor.fax || ''},
        CON_PRV = ${proveedor.correo || ''},
        OBS_PRV = ${proveedor.observaciones || ''},
        CDG_UDIS = ${proveedor.distrito || ''},
        SWT_PRV = ${swtPrv},
        SWT_DECL = ${proveedor.retencion ? 1 : 0},
        SWT_EXT = ${proveedor.exterior ? 1 : 0},
        NOM_PRV = ${(proveedor.nombreProveedor || '').trim().toUpperCase()},
        APE_PAT = ${(proveedor.apellidoPaterno || '').trim().toUpperCase()},
        APE_MAT = ${(proveedor.apellidoMaterno || '').trim().toUpperCase()},
        SWT_DETR = ${proveedor.detraccion ? 1 : 0},
        CDG_TDOC = ${proveedor.tipoDocumento || ''},
        CDG_TPRV = ${proveedor.tipoProveedor || ''},
        SWT_PERC = ${proveedor.percepcion ? 1 : 0},
        cdg_usu = ${proveedor.usuarioModificacion || 'SUPERVISOR'},
        fec_usu = ${fecha},
        hor_usu = ${hora}
      WHERE RUC_PRV = ${proveedor.ruc.trim()}
    `)

    return proveedor
  }

  async eliminar(ruc: string): Promise<void> {
    // Soft delete: cambiar SWT_PRV a 0 (inactivo)
    await prisma.$executeRaw(Prisma.sql`
      UPDATE M_PROVEE
      SET SWT_PRV = 0
      WHERE RUC_PRV = ${ruc.trim()}
    `)
  }

  async obtenerPorRuc(ruc: string): Promise<Proveedor | null> {
    const result = await prisma.$queryRaw<RawProveedor[]>(Prisma.sql`
      SELECT
        LTRIM(RTRIM(RUC_PRV)) as ruc,
        LTRIM(RTRIM(DES_PRV)) as razonSocial,
        LTRIM(RTRIM(DIR_PRV)) as direccion,
        LTRIM(RTRIM(TEL_PRV)) as telefono,
        LTRIM(RTRIM(FAX_PRV)) as fax,
        LTRIM(RTRIM(CON_PRV)) as correo,
        CAST(OBS_PRV as nvarchar(max)) as observaciones,
        LTRIM(RTRIM(CDG_UDIS)) as distrito,
        COALESCE(SWT_PRV, 1) as inactivo,
        COALESCE(SWT_DECL, 0) as retencion,
        COALESCE(SWT_EXT, 0) as exterior,
        LTRIM(RTRIM(NOM_PRV)) as nombreProveedor,
        LTRIM(RTRIM(APE_PAT)) as apellidoPaterno,
        LTRIM(RTRIM(APE_MAT)) as apellidoMaterno,
        COALESCE(SWT_DETR, 0) as detraccion,
        LTRIM(RTRIM(CDG_TDOC)) as tipoDocumento,
        LTRIM(RTRIM(CDG_TPRV)) as tipoProveedor,
        COALESCE(SWT_PERC, 0) as percepcion,
        LTRIM(RTRIM(cdg_usu)) as usuarioModificacion,
        fec_usu as fechaModificacion,
        LTRIM(RTRIM(hor_usu)) as horaModificacion
      FROM M_PROVEE
      WHERE RUC_PRV = ${ruc.trim()}
    `)

    if (result.length === 0) return null
    const row = result[0]

    return {
      ruc: row.ruc,
      razonSocial: row.razonSocial,
      direccion: row.direccion,
      telefono: row.telefono || '',
      fax: row.fax || '',
      correo: row.correo || '',
      observaciones: row.observaciones || '',
      distrito: row.distrito || '',
      inactivo: Number(row.inactivo) === 0, // 0 significa inactivo
      retencion: Number(row.retencion) === 1,
      exterior: Number(row.exterior) === 1,
      nombreProveedor: row.nombreProveedor || '',
      apellidoPaterno: row.apellidoPaterno || '',
      apellidoMaterno: row.apellidoMaterno || '',
      detraccion: Number(row.detraccion) === 1,
      tipoDocumento: row.tipoDocumento || '',
      tipoProveedor: row.tipoProveedor || '',
      percepcion: Number(row.percepcion) === 1,
      usuarioModificacion: row.usuarioModificacion || '',
      fechaModificacion: row.fechaModificacion ? new Date(row.fechaModificacion) : undefined,
      horaModificacion: row.horaModificacion || ''
    }
  }

  async listar(): Promise<ProveedorRow[]> {
    // Listamos los proveedores que estén activos (SWT_PRV = 1)
    const result = await prisma.$queryRaw<ProveedorRow[]>(Prisma.sql`
      SELECT TOP 500
        LTRIM(RTRIM(RUC_PRV)) as ruc,
        LTRIM(RTRIM(DES_PRV)) as razonSocial,
        LTRIM(RTRIM(DIR_PRV)) as direccion
      FROM M_PROVEE
      WHERE SWT_PRV = 1
      ORDER BY DES_PRV ASC
    `)
    return result
  }
}
