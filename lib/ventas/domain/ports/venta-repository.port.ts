// lib/ventas/domain/ports/venta-repository.port.ts

import { Venta } from '@/ventas/domain/entities/venta.entity'

/**
 * Puerto de Salida: VentaRepository
 * Define el contrato (interfaz) para persistir y consultar ventas.
 * La implementación concreta estará en la capa de infraestructura.
 */
export interface VentaRepository {
  crear(venta: Venta): Promise<Venta>
  obtenerPorId(id: string): Promise<Venta | null>
  listar(): Promise<Venta[]>
  actualizarEstado(id: string, estado: Venta['estado']): Promise<void>
}
