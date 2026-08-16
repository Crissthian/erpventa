import {
  listarModulosAction,
  listarOpcionesCatalogoAction,
  listarOpcionesUsuarioAction,
  listarUsuariosSimpleAction
} from '@/actions/configuracion.actions'
import { getSession } from '@/auth/session'
import { AsignarOpcionesClientPage } from '@/components/modules/configuracion/opciones-sistemas/asignar-opciones-client-page'

export default async function AsignarOpcionesPage() {
  const [usuarios, session, modulos, opcionesCatalogo] = await Promise.all([
    listarUsuariosSimpleAction(),
    getSession(),
    listarModulosAction(),
    listarOpcionesCatalogoAction()
  ])

  const usuarioInicial = session?.userId ?? ''
  const opcionesIniciales = usuarioInicial
    ? await listarOpcionesUsuarioAction(usuarioInicial)
    : []

  return (
    <AsignarOpcionesClientPage
      usuarios={usuarios}
      usuarioInicial={usuarioInicial}
      opcionesIniciales={opcionesIniciales}
      modulos={modulos}
      opcionesCatalogo={opcionesCatalogo}
    />
  )
}