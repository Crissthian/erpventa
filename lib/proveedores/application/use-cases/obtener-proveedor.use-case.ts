// lib/proveedores/application/use-cases/obtener-proveedor.use-case.ts

import { Proveedor } from '@/proveedores/domain/entities/proveedor.entity'
import { ProveedorRepository } from '@/proveedores/domain/ports/proveedor-repository.port'

export class ObtenerProveedorPorRucUseCase {
  constructor(private readonly repository: ProveedorRepository) {}

  async execute(ruc: string): Promise<Proveedor | null> {
    if (!ruc || ruc.trim() === '') {
      throw new Error('El RUC del proveedor es obligatorio.')
    }
    return this.repository.obtenerPorRuc(ruc)
  }
}
