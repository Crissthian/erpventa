import { prisma } from '@/core/infrastructure/prisma/client'
import { ProveedorSelectItem } from '@/ventas/domain/entities/proveedor.entity'
import { ProveedorRepository } from '@/ventas/domain/ports/proveedor-repository.port'

export class PrismaProveedorRepository implements ProveedorRepository {
  async listarParaSelect(): Promise<ProveedorSelectItem[]> {
    const result = await prisma.$queryRaw<ProveedorSelectItem[]>`
      SELECT
        LTRIM(RTRIM(RUC_PRV)) as ruc,
        LTRIM(RTRIM(DES_PRV)) as nombre,
        LTRIM(RTRIM(DIR_PRV)) as direccion
      FROM M_PROVEE
      WHERE SWT_PRV = 1
      ORDER BY DES_PRV
    `
    return result
  }

  async buscar(term: string): Promise<ProveedorSelectItem[]> {
    const like = `%${term}%`
    const result = await prisma.$queryRaw<ProveedorSelectItem[]>`
      SELECT
        LTRIM(RTRIM(RUC_PRV)) as ruc,
        LTRIM(RTRIM(DES_PRV)) as nombre,
        LTRIM(RTRIM(DIR_PRV)) as direccion
      FROM M_PROVEE
      WHERE SWT_PRV = 1
        AND (RUC_PRV LIKE ${like} OR DES_PRV LIKE ${like} OR DIR_PRV LIKE ${like})
      ORDER BY DES_PRV
      OFFSET 0 ROWS FETCH NEXT 50 ROWS ONLY
    `
    return result
  }
}

export const prismaProveedorRepository = new PrismaProveedorRepository()
