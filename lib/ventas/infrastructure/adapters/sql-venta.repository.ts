// lib/ventas/infrastructure/adapters/sql-venta.repository.ts

import { Venta } from '@/ventas/domain/entities/venta.entity'
import { VentaRepository } from '@/ventas/domain/ports/venta-repository.port'

/**
 * Adaptador de Infraestructura: SqlVentaRepository
 * Implementa el puerto VentaRepository utilizando SQL Server.
 */
export class SqlVentaRepository implements VentaRepository {
  async crear(venta: Venta): Promise<Venta> {
    // TODO: Ejecutar la consulta SQL nativa en SQL Server usando dbPool
    // Ejemplo: INSERT INTO Ventas ...
    console.log('Guardando venta en SQL Server usando dbPool...', venta)
    return { ...venta, id: 'generado-por-db' }
  }

  async obtenerPorId(_id: string): Promise<Venta | null> {
    // TODO: Consultar en SQL Server
    return null
  }

  async listar(): Promise<Venta[]> {
    // TODO: Consultar todas las ventas
    return []
  }

  async actualizarEstado(_id: string, _estado: Venta['estado']): Promise<void> {
    // TODO: Actualizar estado de la venta en base de datos
  }
}
