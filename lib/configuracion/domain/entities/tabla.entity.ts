export interface Tabla {
  codigo: string // CDG_TAB char(3) NOT NULL
  descripcion: string // DES_TAB varchar(30) NOT NULL
}

export interface ItemTabla {
  codigoTabla: string // CDG_TAB char(3) NOT NULL
  numeroItem: string // NUM_ITEM char(3) NOT NULL
  descripcionItem: string | null // DES_ITEM varchar(250) nullable
}

export interface LimpiezaTablaConfig {
  id: string
  label: string
  tabla: string
  columna: string
}

export interface LimpiezaTablaResultado {
  id: string
  label: string
  tabla: string
  eliminados: number
}

export const TABLAS_LIMPIEZA: LimpiezaTablaConfig[] = [
  { id: 'clientes', label: 'Maestro de clientes', tabla: 'M_CLIENT', columna: 'SWT_CLI' },
  { id: 'proveedores', label: 'Maestro de proveedores', tabla: 'M_PROVEE', columna: 'SWT_PRV' },
  { id: 'productos', label: 'Maestro de productos', tabla: 'M_PRODUC', columna: 'SWT_PROD' },
  { id: 'configuracion', label: 'Maestro de configuración', tabla: 'D_TABLAS', columna: 'SWT_ITEM' },
  { id: 'choferes', label: 'Choferes', tabla: 'M_CHOFER', columna: 'SWT_CHOF' },
  { id: 'vendedores', label: 'Vendedores', tabla: 'M_VENDED', columna: 'SWT_VEND' },
  { id: 'cobradores', label: 'Cobradores', tabla: 'M_COBRAD', columna: 'SWT_COB' },
  { id: 'usuarios', label: 'Maestro de usuarios', tabla: 'M_USUARI', columna: 'SWT_USR' },
  { id: 'cuentas-bancarias', label: 'Cuentas bancarias', tabla: 'T_CTABCO', columna: 'SWT_CTA' }
]
