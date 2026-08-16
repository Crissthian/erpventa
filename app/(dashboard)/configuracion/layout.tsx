import { ModuloGuard } from '@/components/modules/dashboard/modulo-guard'
import { ReactNode } from 'react'

export default async function ConfiguracionLayout({ children }: { children: ReactNode }) {
  return <ModuloGuard codigoOpc="CNF">{children}</ModuloGuard>
}
