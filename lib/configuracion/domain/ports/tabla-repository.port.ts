import {
  ItemTabla,
  LimpiezaTablaConfig,
  LimpiezaTablaResultado,
  Tabla
} from '@/configuracion/domain/entities/tabla.entity'

export interface TablaRepository {
  obtenerTodas(): Promise<Tabla[]>
  obtenerItemsPorCodigo(codigoTabla: string): Promise<ItemTabla[]>
  existeCodigo(codigo: string): Promise<boolean>
  crearTabla(codigo: string, descripcion: string): Promise<void>
  actualizarTabla(codigo: string, descripcion: string): Promise<void>
  eliminarTabla(codigo: string): Promise<void>
  crearItem(codigoTabla: string, numeroItem: string, descripcionItem: string): Promise<void>
  actualizarItem(codigoTabla: string, numeroItem: string, descripcionItem: string): Promise<void>
  eliminarItem(codigoTabla: string, numeroItem: string): Promise<void>
  limpiarTablas(configs: LimpiezaTablaConfig[]): Promise<LimpiezaTablaResultado[]>
}
