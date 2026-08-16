import { Prisma } from '@prisma/client'

import { OpcionUsuario } from '@/configuracion/domain/entities/opcion-usuario.entity'
import { OpcionUsuarioRepository } from '@/configuracion/domain/ports/opcion-usuario-repository.port'
import { prisma } from '@/core/infrastructure/prisma/client'

export class SqlOpcionUsuarioRepository implements OpcionUsuarioRepository {
  /**
   * Inserta o actualiza la asignación de una opción a un usuario en D_USUARI.
   * La clave natural es (CDG_USR, CDG_OPC, NUM_ITEM); no existe PK en la tabla,
   * por lo que se usa MERGE para evitar duplicados.
   */
  async guardar(opcion: OpcionUsuario): Promise<void> {
    const codigoUsuario = opcion.codigoUsuario.trim().toUpperCase().padEnd(10)
    const codigoOpcion = opcion.codigoOpcion.trim().toUpperCase().padEnd(3)
    const numeroItem = opcion.numeroItem.trim().padStart(3, '0')

    await prisma.$executeRaw(Prisma.sql`
      MERGE INTO D_USUARI AS target
      USING (SELECT ${codigoUsuario} AS CDG_USR, ${codigoOpcion} AS CDG_OPC, ${numeroItem} AS NUM_ITEM) AS source
        ON target.CDG_USR = source.CDG_USR
       AND target.CDG_OPC = source.CDG_OPC
       AND target.NUM_ITEM = source.NUM_ITEM
      WHEN MATCHED THEN
        UPDATE SET SWT_OPC = ${opcion.swtOpc}
      WHEN NOT MATCHED THEN
        INSERT (CDG_USR, CDG_OPC, NUM_ITEM, SWT_OPC)
        VALUES (source.CDG_USR, source.CDG_OPC, source.NUM_ITEM, ${opcion.swtOpc});
    `)
  }

  /**
   * Devuelve los códigos de módulo (CDG_OPC) activos del usuario (SWT_OPC = 1).
   */
  async obtenerModulosPermitidos(codigoUsuario: string): Promise<string[]> {
    const rows = await prisma.$queryRaw<Array<{ codigoModulo: string }>>(Prisma.sql`
      SELECT DISTINCT LTRIM(RTRIM(CDG_OPC)) as codigoModulo
      FROM D_USUARI
      WHERE CDG_USR = ${codigoUsuario.trim().toUpperCase()}
        AND SWT_OPC = 1
      ORDER BY codigoModulo
    `)
    return rows.map((r) => r.codigoModulo.trim())
  }
}