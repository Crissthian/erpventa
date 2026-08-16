// lib/proveedores/application/use-cases/guardar-proveedor.use-case.ts

import { Proveedor } from '@/proveedores/domain/entities/proveedor.entity'
import { ProveedorRepository } from '@/proveedores/domain/ports/proveedor-repository.port'

export class GuardarProveedorUseCase {
  constructor(private readonly repository: ProveedorRepository) {}

  async execute(proveedor: Proveedor): Promise<Proveedor> {
    if (!proveedor.ruc || proveedor.ruc.trim() === '') {
      throw new Error('El RUC del proveedor es obligatorio.')
    }
    if (!proveedor.razonSocial || proveedor.razonSocial.trim() === '') {
      throw new Error('La Razón Social del proveedor es obligatoria.')
    }
    if (!proveedor.direccion || proveedor.direccion.trim() === '') {
      throw new Error('La dirección del proveedor es obligatoria.')
    }

    const existe = await this.repository.obtenerPorRuc(proveedor.ruc)
    if (existe) {
      return this.repository.actualizar(proveedor)
    } else {
      return this.repository.crear(proveedor)
    }
  }
}
