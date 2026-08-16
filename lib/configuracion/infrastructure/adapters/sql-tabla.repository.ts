import { Prisma } from '@prisma/client'

import {
  ItemTabla,
  LimpiezaTablaConfig,
  LimpiezaTablaResultado,
  Tabla
} from '@/configuracion/domain/entities/tabla.entity'
import { TablaRepository } from '@/configuracion/domain/ports/tabla-repository.port'
import { prisma } from '@/core/infrastructure/prisma/client'

export class SqlTablaRepository implements TablaRepository {
  /**
   * Obtiene todas las tablas del sistema desde M_TABLAS.
   */
  async obtenerTodas(): Promise<Tabla[]> {
    const list = await prisma.tabla.findMany({
      take: 500,
      orderBy: {
        descripcion: 'asc'
      }
    })

    return list.map((row) => ({
      codigo: row.codigo.trim(),
      descripcion: row.descripcion.trim()
    }))
  }

  /**
   * Obtiene los items de detalle de una tabla específica desde D_TABLAS.
   */
  async obtenerItemsPorCodigo(codigoTabla: string): Promise<ItemTabla[]> {
    const list = await prisma.itemTabla.findMany({
      take: 500,
      where: {
        codigoTabla: codigoTabla.trim(),
        swtItem: {
          not: 0
        }
      },
      orderBy: {
        numeroItem: 'asc'
      }
    })

    return list.map((row) => ({
      codigoTabla: row.codigoTabla.trim(),
      numeroItem: row.numeroItem.trim(),
      descripcionItem: row.descripcionItem ? row.descripcionItem.trim() : null
    }))
  }

  /**
   * Verifica si ya existe una tabla con el código indicado en M_TABLAS.
   */
  async existeCodigo(codigo: string): Promise<boolean> {
    const count = await prisma.tabla.count({
      where: {
        codigo: codigo.trim()
      }
    })
    return count > 0
  }

  /**
   * Inserta una nueva tabla en M_TABLAS.
   */
  async crearTabla(codigo: string, descripcion: string): Promise<void> {
    await prisma.tabla.create({
      data: {
        codigo: codigo.trim(),
        descripcion: descripcion.trim().toUpperCase()
      }
    })
  }

  /**
   * Actualiza la descripción de una tabla existente en M_TABLAS.
   */
  async actualizarTabla(codigo: string, descripcion: string): Promise<void> {
    await prisma.tabla.update({
      where: {
        codigo: codigo.trim()
      },
      data: {
        descripcion: descripcion.trim().toUpperCase()
      }
    })
  }

  /**
   * Elimina una tabla de M_TABLAS. Los items asociados en D_TABLAS se eliminan
   * en cascada según la relación configurada en el esquema.
   */
  async eliminarTabla(codigo: string): Promise<void> {
    await prisma.tabla.delete({
      where: {
        codigo: codigo.trim()
      }
    })
  }

  /**
   * Inserta un nuevo item en D_TABLAS.
   */
  async crearItem(codigoTabla: string, numeroItem: string, descripcionItem: string): Promise<void> {
    await prisma.itemTabla.create({
      data: {
        codigoTabla: codigoTabla.trim(),
        numeroItem: numeroItem.trim(),
        descripcionItem: descripcionItem.trim().toUpperCase(),
        swtItem: 1
      }
    })
  }

  /**
   * Actualiza la descripción de un item existente en D_TABLAS.
   */
  async actualizarItem(
    codigoTabla: string,
    numeroItem: string,
    descripcionItem: string
  ): Promise<void> {
    await prisma.itemTabla.update({
      where: {
        codigoTabla_numeroItem: {
          codigoTabla: codigoTabla.trim(),
          numeroItem: numeroItem.trim()
        }
      },
      data: {
        descripcionItem: descripcionItem.trim().toUpperCase()
      }
    })
  }

  /**
   * Elimina un item de D_TABLAS por código de tabla y número de item (Soft Delete).
   */
  async eliminarItem(codigoTabla: string, numeroItem: string): Promise<void> {
    await prisma.itemTabla.update({
      where: {
        codigoTabla_numeroItem: {
          codigoTabla: codigoTabla.trim(),
          numeroItem: numeroItem.trim()
        }
      },
      data: {
        swtItem: 0
      }
    })
  }

  /**
   * Elimina en una única transacción los registros con <columna> = 0 de cada
   * tabla maestra seleccionada. Si alguna operación falla, se revierte todo.
   */
  async limpiarTablas(configs: LimpiezaTablaConfig[]): Promise<LimpiezaTablaResultado[]> {
    return prisma.$transaction(async (tx) => {
      const resultados: LimpiezaTablaResultado[] = []

      for (const config of configs) {
        // tabla/columna provienen de un mapeo fijo del servidor (TABLAS_LIMPIEZA),
        // nunca de entrada del usuario, por lo que se intercalan como identificadores.
        const eliminados = await tx.$executeRaw(Prisma.sql`
          DELETE FROM ${Prisma.raw(config.tabla)}
          WHERE ${Prisma.raw(config.columna)} = 0
        `)

        resultados.push({
          id: config.id,
          label: config.label,
          tabla: config.tabla,
          eliminados
        })
      }

      return resultados
    })
  }
}
