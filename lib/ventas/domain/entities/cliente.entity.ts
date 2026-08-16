export interface ClienteSelectItem {
  ruc: string
  nombre: string
  direccion: string
}

export interface Cliente {
  ruc: string
  razonSocial: string
  activo: number
  direccion: string
  provincia: string
  distrito: string
  telefono: string
  fax: string
  tipoCliente: string
  condicionPago: string
  vendedor: string

  // Campos opcionales para almacenar codigos relacionales (persistencia/formulario)
  codigoProvincia?: string
  codigoDistrito?: string
  codigoTipoCliente?: string
  codigoCondicionPago?: string
  codigoVendedor?: string
}
