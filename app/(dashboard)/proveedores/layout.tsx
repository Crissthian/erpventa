import { ModuloGuard } from '@/components/modules/dashboard/modulo-guard'
import { ReactNode } from 'react'

export default async function ProveedoresLayout({ children }: { children: ReactNode }) {
  return <ModuloGuard codigoOpc="PRV">{children}</ModuloGuard>
}
