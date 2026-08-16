// lib/proveedores/domain/entities/proveedor.entity.ts

/**
 * Entidad de Dominio: Proveedor
 * Representa un proveedor en el sistema y mapea con la tabla M_PROVEE.
 */
export interface Proveedor {
  ruc: string
  razonSocial: string
  direccion: string
  telefono?: string
  fax?: string
  correo?: string
  observaciones?: string
  distrito?: string
  inactivo: boolean
  retencion: boolean
  exterior: boolean
  nombreProveedor?: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  detraccion: boolean
  tipoDocumento?: string
  tipoProveedor?: string
  percepcion: boolean
  usuarioModificacion?: string
  fechaModificacion?: Date
  horaModificacion?: string
}
