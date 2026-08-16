import { Prisma } from '@prisma/client'
import { prisma } from '@/core/infrastructure/prisma/client'
import { OpcionesSistema } from '@/configuracion/domain/entities/opciones-sistema.entity'
import { OpcionesSistemaRepository } from '@/configuracion/domain/ports/opciones-sistema-repository.port'

export class PrismaOpcionesSistemaRepository implements OpcionesSistemaRepository {
  async obtener(): Promise<OpcionesSistema | null> {
    const result = await prisma.$queryRaw<
      Array<{
        mstock: number
        mcancel: number
        nruc: string
        nigv: string
        nporigv: number
        n1: number
        n2: number
        n3: number | null
        n4: string
        n5: string
        n6: string
        n7: number | null
        nref1: number
        cref1: string
        nref2: number
        cref2: string
        nref3: number
        cref3: string
        nref4: number
        cref4: string | null
      }>
    >(Prisma.sql`
      SELECT
        CAST(MSTOCK AS FLOAT) as mstock,
        CAST(MCANCEL AS FLOAT) as mcancel,
        LTRIM(RTRIM(NRUC)) as nruc,
        LTRIM(RTRIM(NIGV)) as nigv,
        CAST(NPORIGV AS FLOAT) as nporigv,
        CAST(N1 AS FLOAT) as n1,
        CAST(N2 AS FLOAT) as n2,
        CAST(ISNULL(N3, 0) AS FLOAT) as n3,
        LTRIM(RTRIM(ISNULL(N4, ''))) as n4,
        LTRIM(RTRIM(ISNULL(N5, ''))) as n5,
        LTRIM(RTRIM(ISNULL(N6, ''))) as n6,
        CAST(ISNULL(N7, 0) AS FLOAT) as n7,
        CAST(NREF1 AS FLOAT) as nref1,
        LTRIM(RTRIM(ISNULL(CREF1, ''))) as cref1,
        CAST(NREF2 AS FLOAT) as nref2,
        LTRIM(RTRIM(ISNULL(CREF2, ''))) as cref2,
        CAST(NREF3 AS FLOAT) as nref3,
        LTRIM(RTRIM(ISNULL(CREF3, ''))) as cref3,
        CAST(NREF4 AS FLOAT) as nref4,
        LTRIM(RTRIM(ISNULL(CAST(CREF4 AS VARCHAR(30)), ''))) as cref4
      FROM T_TABLAS
    `)

    if (result.length === 0) return null
    const row = result[0]

    const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(row.n4) ? row.n4 : ''

    return {
      mstock: row.mstock,
      mcancel: row.mcancel,
      nruc: row.nruc,
      nigv: row.nigv,
      nporigv: row.nporigv,
      n1: row.n1,
      n2: row.n2,
      n3: row.n3,
      n4: fechaValida,
      n5: row.n5,
      n6: row.n6,
      n7: row.n7,
      nref1: row.nref1,
      cref1: row.cref1,
      nref2: row.nref2,
      cref2: row.cref2,
      nref3: row.nref3,
      cref3: row.cref3,
      nref4: row.nref4,
      cref4: row.cref4
    }
  }

  async guardar(opciones: OpcionesSistema): Promise<void> {
    await prisma.$executeRaw(Prisma.sql`
      UPDATE T_TABLAS SET
        MSTOCK = ${opciones.mstock},
        MCANCEL = ${opciones.mcancel},
        NRUC = ${opciones.nruc},
        NIGV = ${opciones.nigv},
        NPORIGV = ${opciones.nporigv},
        N1 = ${opciones.n1},
        N2 = ${opciones.n2},
        N3 = ${opciones.n3},
        N4 = ${opciones.n4},
        N5 = ${opciones.n5},
        N6 = ${opciones.n6},
        N7 = ${opciones.n7},
        NREF1 = ${opciones.nref1},
        CREF1 = ${opciones.cref1},
        NREF2 = ${opciones.nref2},
        CREF2 = ${opciones.cref2},
        NREF3 = ${opciones.nref3},
        CREF3 = ${opciones.cref3},
        NREF4 = ${opciones.nref4},
        CREF4 = ${opciones.cref4}
    `)
  }
}

export const prismaOpcionesSistemaRepository = new PrismaOpcionesSistemaRepository()
