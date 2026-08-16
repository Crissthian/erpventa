export type NivelAcceso = '1' | '2' | '3'

export interface PuntosVenta {
  guiasRemision: string
  factura: string
  boleta: string
  notaCreditoF: string
  notaCreditoB: string
  notaDebito: string
}

export interface Usuario {
  codigo: string
  username: string
  password: string
  nombre: string
  nivel: NivelAcceso
  activo: boolean
  puntosVenta: PuntosVenta
}
