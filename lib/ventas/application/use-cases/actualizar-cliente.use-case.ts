import { Cliente } from '@/ventas/domain/entities/cliente.entity'
import { ClienteRepository } from '@/ventas/domain/ports/cliente-repository.port'

export class ActualizarClienteUseCase {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async execute(cliente: Cliente, usuarioCdg: string): Promise<void> {
    const existe = await this.clienteRepository.obtenerPorRuc(cliente.ruc)
    if (!existe) {
      throw new Error(`No se encontró el cliente con RUC ${cliente.ruc} para actualizar`)
    }

    await this.clienteRepository.actualizar(cliente, usuarioCdg)
  }
}
