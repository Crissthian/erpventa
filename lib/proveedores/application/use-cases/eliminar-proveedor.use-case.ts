// lib/proveedores/application/use-cases/eliminar-proveedor.use-case.ts

import { ProveedorRepository } from '@/proveedores/domain/ports/proveedor-repository.port'

export class EliminarProveedorUseCase {
  constructor(private readonly repository: ProveedorRepository) {}

  async execute(ruc: string): Promise<void> {
    if (!ruc || ruc.trim() === '') {
      throw new Error('El RUC del proveedor a eliminar no puede estar vacío.')
    }
    const existe = await this.repository.obtenerPorRuc(ruc)
    if (!existe) {
      throw new Error(`El proveedor con RUC '${ruc}' no existe.`)
    }
    await this.repository.eliminar(ruc)
  }
}
