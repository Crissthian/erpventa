import { TablaRepository } from '@/configuracion/domain/ports/tabla-repository.port'

export class CrearTablaUseCase {
  constructor(private readonly tablaRepository: TablaRepository) {}

  async execute(codigo: string, descripcion: string): Promise<void> {
    const existe = await this.tablaRepository.existeCodigo(codigo)
    if (existe) {
      throw new Error('El código de tabla ya existe')
    }

    return this.tablaRepository.crearTabla(codigo, descripcion)
  }
}
