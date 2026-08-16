import { ModuloGuard } from '@/components/modules/dashboard/modulo-guard'
import { ReactNode } from 'react'

export default async function CostosLayout({ children }: { children: ReactNode }) {
  return <ModuloGuard codigoOpc="SIG">{children}</ModuloGuard>
}
