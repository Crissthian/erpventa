import { obtenerOpcionesSistemaAction } from '@/actions/configuracion.actions'
import { OpcionesSistemaClientPage } from '@/components/modules/configuracion/opciones-sistemas/opciones-sistema-client-page'

export default async function OpcionesSistemaPage() {
  const opcionesIniciales = await obtenerOpcionesSistemaAction()

  return <OpcionesSistemaClientPage opcionesIniciales={opcionesIniciales} />
}
