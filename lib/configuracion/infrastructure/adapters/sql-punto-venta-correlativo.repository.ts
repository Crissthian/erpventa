import {
  CorrelacionTipo,
  Correlativo
} from '@/configuracion/domain/entities/punto-venta-correlativo.entity'
import { PuntoVentaCorrelativoRepository } from '@/configuracion/domain/ports/punto-venta-correlativo-repository.port'
import { prisma } from '@/core/infrastructure/prisma/client'

export class SqlPuntoVentaCorrelativoRepository implements PuntoVentaCorrelativoRepository {
  /**
   * Busca un correlativo por tipo y serie en la tabla correspondiente.
   * T_DOCCLI para documentos, T_GUIA para guías.
   */
  async buscarPorTipoYSerie(
    correlacion: CorrelacionTipo,
    tipo: string,
    serie: string
  ): Promise<Correlativo | null> {
    if (correlacion === 'documento') {
      const rows = await prisma.$queryRaw<{ NUM_DOCU: string | null }[]>`
        SELECT NUM_DOCU FROM T_DOCCLI
        WHERE CDG_TDOC = ${tipo.trim()} AND RTRIM(NUM_SER) = ${serie.trim()}
      `
      if (rows.length === 0) return null
      return { tipoDocumento: tipo, serie, numero: rows[0].NUM_DOCU?.trim() ?? null }
    }

    const rows = await prisma.$queryRaw<{ NUM_GUIA: string | null }[]>`
      SELECT NUM_GUIA FROM T_GUIA
      WHERE CDG_TPG = ${tipo.trim()} AND RTRIM(NUM_SER) = ${serie.trim()}
    `
    if (rows.length === 0) return null
    return { tipoDocumento: tipo, serie, numero: rows[0].NUM_GUIA?.trim() ?? null }
  }

  /**
   * Crea un nuevo correlativo en la tabla correspondiente.
   */
  async crear(input: {
    correlacion: CorrelacionTipo
    tipo: string
    serie: string
    numero: string
  }): Promise<void> {
    if (input.correlacion === 'documento') {
      await prisma.$executeRaw`
        INSERT INTO T_DOCCLI (CDG_TDOC, NUM_SER, NUM_DOCU)
        VALUES (${input.tipo.trim().toUpperCase()}, ${input.serie.trim().toUpperCase()}, ${input.numero.trim().toUpperCase()})
      `
      return
    }
    await prisma.$executeRaw`
      INSERT INTO T_GUIA (CDG_TPG, NUM_SER, NUM_GUIA)
      VALUES (${input.tipo.trim()}, ${input.serie.trim()}, ${input.numero.trim()})
    `
  }

  /**
   * Actualiza el número de un correlativo existente identificado por tipo y serie.
   */
  async actualizarNumero(
    correlacion: CorrelacionTipo,
    tipo: string,
    serie: string,
    numero: string
  ): Promise<void> {
    if (correlacion === 'documento') {
      await prisma.$executeRaw`
        UPDATE T_DOCCLI SET NUM_DOCU = ${numero.trim()}
        WHERE CDG_TDOC = ${tipo.trim().toUpperCase()} AND RTRIM(NUM_SER) = ${serie.trim().toUpperCase()}
      `
      return
    }
    await prisma.$executeRaw`
      UPDATE T_GUIA SET NUM_GUIA = ${numero.trim()}
      WHERE CDG_TPG = ${tipo.trim().toUpperCase()} AND RTRIM(NUM_SER) = ${serie.trim().toUpperCase()}
    `
  }

  /**
   * Obtiene todos los correlativos registrados en la tabla correspondiente.
   */
  async listar(correlacion: CorrelacionTipo): Promise<Correlativo[]> {
    if (correlacion === 'documento') {
      const rows = await prisma.$queryRaw<{ CDG_TDOC: string; NUM_SER: string; NUM_DOCU: string | null }[]>`
        SELECT CDG_TDOC, NUM_SER, NUM_DOCU FROM T_DOCCLI
        ORDER BY CDG_TDOC ASC, NUM_SER ASC
      `
      return rows.map((r) => ({
        tipoDocumento: r.CDG_TDOC.trim(),
        serie: r.NUM_SER.trim(),
        numero: r.NUM_DOCU?.trim() ?? null
      }))
    }

    const rows = await prisma.$queryRaw<{ CDG_TPG: string; NUM_SER: string; NUM_GUIA: string | null }[]>`
      SELECT CDG_TPG, NUM_SER, NUM_GUIA FROM T_GUIA
      ORDER BY CDG_TPG ASC, NUM_SER ASC
    `
    return rows.map((r) => ({
      tipoDocumento: r.CDG_TPG.trim(),
      serie: r.NUM_SER.trim(),
      numero: r.NUM_GUIA?.trim() ?? null
    }))
  }
}
