export interface OpcionUsuario {
  codigoUsuario: string // CDG_USR char(10)
  codigoOpcion: string // CDG_OPC char(3)
  numeroItem: string // NUM_ITEM char(3)
  swtOpc: number // SWT_OPC int (1 activo, 0 inactivo)
}