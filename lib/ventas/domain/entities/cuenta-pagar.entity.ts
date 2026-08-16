export interface CuentaPagarPorRuc {
  tipoDocumento: string
  numDocumento: string
  proveedor: string
  direccion: string
  saldo: number
  vencimiento: string
}

export interface CuentasPagarFiltro {
  ruc: string
  tipoDocumento?: string
  numeroDocumento?: string
  fechaDocumento?: string
  fechaVencimiento?: string
  saldo?: number
}
