import { OpcionesSistema } from '@/configuracion/domain/entities/opciones-sistema.entity'

export interface OpcionesSistemaRepository {
  obtener(): Promise<OpcionesSistema | null>
  guardar(opciones: OpcionesSistema): Promise<void>
}
