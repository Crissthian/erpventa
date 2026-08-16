import { ProveedorSelectItem } from '../entities/proveedor.entity'

export interface ProveedorRepository {
  listarParaSelect(): Promise<ProveedorSelectItem[]>
  buscar(term: string): Promise<ProveedorSelectItem[]>
}
