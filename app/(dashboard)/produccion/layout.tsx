import { ModuloGuard } from '@/components/modules/dashboard/modulo-guard'
import { ReactNode } from 'react'

export default async function ProduccionLayout({ children }: { children: ReactNode }) {
  return <ModuloGuard codigoOpc="PRO">{children}</ModuloGuard>
}
