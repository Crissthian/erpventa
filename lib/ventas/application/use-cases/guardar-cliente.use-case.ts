import { Cliente } from '@/ventas/domain/entities/cliente.entity'
import { ClienteRepository } from '@/ventas/domain/ports/cliente-repository.port'

export class GuardarClienteUseCase {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async execute(cliente: Cliente, usuarioCdg: string): Promise<void> {
    const existe = await this.clienteRepository.obtenerPorRuc(cliente.ruc)
    if (existe) {
      throw new Error(`Ya existe un cliente registrado con el RUC ${cliente.ruc}`)
    }

    await this.clienteRepository.guardar(cliente, usuarioCdg)
  }
}
