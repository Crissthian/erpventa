import { Cliente, ClienteSelectItem } from '@/ventas/domain/entities/cliente.entity'

export interface ClienteRepository {
  obtenerTodos(): Promise<Cliente[]>
  obtenerPorRuc(ruc: string): Promise<Cliente | null>
  listarParaSelect(): Promise<ClienteSelectItem[]>
  buscar(term: string): Promise<ClienteSelectItem[]>
  guardar(cliente: Cliente, usuarioCdg: string): Promise<void>
  actualizar(cliente: Cliente, usuarioCdg: string): Promise<void>
  eliminar(ruc: string): Promise<void>
}
