import type { ClienteSelectItem } from '@/ventas/domain/entities/cliente.entity'
import type { ClienteRepository } from '@/ventas/domain/ports/cliente-repository.port'

export class ListarClientesSelectUseCase {
  constructor(private readonly repository: ClienteRepository) {}

  async execute(): Promise<ClienteSelectItem[]> {
    return this.repository.listarParaSelect()
  }
}
