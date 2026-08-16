import { ModuloGuard } from '@/components/modules/dashboard/modulo-guard'
import { ReactNode } from 'react'

export default async function ContabilidadLayout({ children }: { children: ReactNode }) {
  return <ModuloGuard codigoOpc="INT">{children}</ModuloGuard>
}
