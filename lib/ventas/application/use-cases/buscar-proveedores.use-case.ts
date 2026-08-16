import { ProveedorSelectItem } from '@/ventas/domain/entities/proveedor.entity'
import { ProveedorRepository } from '@/ventas/domain/ports/proveedor-repository.port'

const MIN_TERM_LENGTH = 3

export class BuscarProveedoresUseCase {
  constructor(private readonly repository: ProveedorRepository) {}

  async execute(term: string): Promise<ProveedorSelectItem[]> {
    const clean = term.trim()
    if (clean.length < MIN_TERM_LENGTH) return []
    return this.repository.buscar(clean)
  }
}
