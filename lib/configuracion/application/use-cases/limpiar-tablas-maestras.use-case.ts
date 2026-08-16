import {
  LimpiezaTablaResultado,
  TABLAS_LIMPIEZA
} from '@/configuracion/domain/entities/tabla.entity'
import { TablaRepository } from '@/configuracion/domain/ports/tabla-repository.port'

export class LimpiarTablasMaestrasUseCase {
  constructor(private readonly tablaRepository: TablaRepository) {}

  async execute(idsSeleccionados: string[]): Promise<LimpiezaTablaResultado[]> {
    if (idsSeleccionados.length === 0) return []

    const configs = TABLAS_LIMPIEZA.filter((t) => idsSeleccionados.includes(t.id))
    if (configs.length === 0) return []

    return this.tablaRepository.limpiarTablas(configs)
  }
}