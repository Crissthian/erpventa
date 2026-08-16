export interface CuentaCobrar {
  tipoDocumento: string
  numeroDocumento: string
  rucCliente: string
  nombreCliente: string
  direccionCliente: string
  moneda: string
  fechaDocumento: string
  fechaVencimiento: string
  importeDocumento: number
  importePagado: number
  saldo: number
  estado: 'Pendiente' | 'En Proceso' | 'Cancelado' | 'Desconocido'
}

export interface CuentaCobrarPorRuc {
  tipoDocumento: string
  numDocumento: string
  cliente: string
  direccion: string
  saldo: number
  vencimiento: string
}

export interface CuentasCobrarFiltro {
  ruc: string
  tipoDocumento?: string
  numeroDocumento?: string
  fechaDocumento?: string
  fechaVencimiento?: string
  saldo?: number
}
