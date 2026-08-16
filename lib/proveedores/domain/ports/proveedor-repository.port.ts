// lib/proveedores/domain/ports/proveedor-repository.port.ts

import { Proveedor } from '@/proveedores/domain/entities/proveedor.entity'

export interface ProveedorRow {
  ruc: string
  razonSocial: string
  direccion: string
}

export interface ProveedorRepository {
  crear(proveedor: Proveedor): Promise<Proveedor>
  actualizar(proveedor: Proveedor): Promise<Proveedor>
  eliminar(ruc: string): Promise<void>
  obtenerPorRuc(ruc: string): Promise<Proveedor | null>
  listar(): Promise<ProveedorRow[]>
}
