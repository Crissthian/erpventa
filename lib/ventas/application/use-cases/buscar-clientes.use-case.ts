import type { ClienteSelectItem } from '@/ventas/domain/entities/cliente.entity'
import type { ClienteRepository } from '@/ventas/domain/ports/cliente-repository.port'

const MIN_TERM_LENGTH = 3

export class BuscarClientesUseCase {
  constructor(private readonly repository: ClienteRepository) {}

  async execute(term: string): Promise<ClienteSelectItem[]> {
    const clean = term.trim()
    if (clean.length < MIN_TERM_LENGTH) return []
    return this.repository.buscar(clean)
  }
}
