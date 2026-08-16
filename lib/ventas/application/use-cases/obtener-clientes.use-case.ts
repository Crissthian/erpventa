import { Cliente } from '@/ventas/domain/entities/cliente.entity'
import { ClienteRepository } from '@/ventas/domain/ports/cliente-repository.port'

export class ObtenerClientesUseCase {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async execute(): Promise<Cliente[]> {
    return this.clienteRepository.obtenerTodos()
  }
}
