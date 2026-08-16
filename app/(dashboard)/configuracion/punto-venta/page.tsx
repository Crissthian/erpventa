import { obtenerTiposDocumentoPVAction } from '@/actions/punto-venta.actions'
import { PuntoVentaClientPage } from '@/components/modules/configuracion/punto-venta/punto-venta-client-page'

export default async function PuntoVentaPage() {
  const tiposDocumento = await obtenerTiposDocumentoPVAction()
  return <PuntoVentaClientPage tiposDocumentoInitiales={tiposDocumento} />
}
