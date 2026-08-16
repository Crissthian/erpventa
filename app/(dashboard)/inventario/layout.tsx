import { ModuloGuard } from '@/components/modules/dashboard/modulo-guard'
import { ReactNode } from 'react'

export default async function InventarioLayout({ children }: { children: ReactNode }) {
  return <ModuloGuard codigoOpc="ALM">{children}</ModuloGuard>
}
