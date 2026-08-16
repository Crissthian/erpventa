import { TipoCambio } from '@/configuracion/domain/entities/tipo-cambio.entity'

export interface TipoCambioRepository {
  listarHistorial(): Promise<TipoCambio[]>
  guardar(tipoCambio: TipoCambio): Promise<void>
}
