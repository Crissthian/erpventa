// lib/ventas/application/use-cases/obtener-tipos-proveedor.use-case.ts

import { SelectOption } from '@/ventas/domain/entities/select-option.entity'
import { SelectOptionsRepository } from '@/ventas/domain/ports/select-options-repository.port'

export class ObtenerTiposProveedorUseCase {
  constructor(private readonly repository: SelectOptionsRepository) {}

  async execute(): Promise<SelectOption[]> {
    return this.repository.obtenerTiposProveedor()
  }
}
