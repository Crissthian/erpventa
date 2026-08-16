import { SelectOption } from '@/ventas/domain/entities/select-option.entity'

export interface SelectOptionsRepository {
  obtenerProvincias(): Promise<SelectOption[]>
  obtenerDistritos(): Promise<SelectOption[]>
  obtenerTiposCliente(): Promise<SelectOption[]>
  obtenerVendedores(): Promise<SelectOption[]>
  obtenerCondicionesPago(): Promise<SelectOption[]>
  obtenerTiposDocumento(): Promise<SelectOption[]>
  obtenerMonedas(): Promise<SelectOption[]>
  obtenerLineas(): Promise<SelectOption[]>
  obtenerSiguienteCodigoProducto(abreviatura: string): Promise<string>
  obtenerTiposProducto(): Promise<SelectOption[]>
  obtenerProcedencias(): Promise<SelectOption[]>
  obtenerSubFamilias(): Promise<SelectOption[]>
  obtenerUnidadesMedida(): Promise<SelectOption[]>
  obtenerTiposProveedor(): Promise<SelectOption[]>
}
