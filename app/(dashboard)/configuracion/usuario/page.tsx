import { listarUsuariosAction } from '@/actions/usuarios.actions'
import { UsuarioClientPage } from '@/components/modules/configuracion/usuarios/usuario-client-page'

export default async function UsuarioPage() {
  const usuarios = await listarUsuariosAction()
  return <UsuarioClientPage usuariosIniciales={usuarios} />
}
