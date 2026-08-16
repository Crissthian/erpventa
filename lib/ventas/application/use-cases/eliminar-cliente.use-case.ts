import { ClienteRepository } from '@/ventas/domain/ports/cliente-repository.port'

export class EliminarClienteUseCase {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async execute(ruc: string): Promise<void> {
    const existe = await this.clienteRepository.obtenerPorRuc(ruc)
    if (!existe) {
      throw new Error(`No se encontró el cliente con RUC ${ruc} para eliminar`)
    }

    await this.clienteRepository.eliminar(ruc)
  }
}
