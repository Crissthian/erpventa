// lib/ventas/application/use-cases/crear-venta.use-case.ts

import { Venta } from '@/ventas/domain/entities/venta.entity'
import { VentaRepository } from '@/ventas/domain/ports/venta-repository.port'

/**
 * Caso de Uso: CrearVentaUseCase
 * Coordina la lógica de negocio para registrar una nueva venta.
 */
export class CrearVentaUseCase {
  constructor(private readonly ventaRepository: VentaRepository) {}

  async execute(input: Omit<Venta, 'estado'>): Promise<Venta> {
    // Regla de negocio: Toda venta nueva inicia en estado 'pendiente'
    const nuevaVenta: Venta = {
      ...input,
      estado: 'pendiente',
      fechaCreacion: new Date()
    }

    // Validar el total (ej: debe ser mayor a 0)
    if (nuevaVenta.total <= 0) {
      throw new Error('El total de la venta debe ser mayor a cero.')
    }

    return this.ventaRepository.crear(nuevaVenta)
  }
}
