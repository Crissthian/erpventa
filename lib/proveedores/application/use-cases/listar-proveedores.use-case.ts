// lib/proveedores/application/use-cases/listar-proveedores.use-case.ts

import { ProveedorRepository, ProveedorRow } from '@/proveedores/domain/ports/proveedor-repository.port'

export class ListarProveedoresUseCase {
  constructor(private readonly repository: ProveedorRepository) {}

  async execute(): Promise<ProveedorRow[]> {
    return this.repository.listar()
  }
}
