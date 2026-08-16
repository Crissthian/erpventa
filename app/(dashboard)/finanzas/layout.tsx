import { ModuloGuard } from '@/components/modules/dashboard/modulo-guard'
import { ReactNode } from 'react'

export default async function FinanzasLayout({ children }: { children: ReactNode }) {
  return <ModuloGuard codigoOpc="TES">{children}</ModuloGuard>
}
