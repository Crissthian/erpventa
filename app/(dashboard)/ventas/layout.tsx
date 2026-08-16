import { ModuloGuard } from '@/components/modules/dashboard/modulo-guard'
import { ReactNode } from 'react'

export default async function VentasLayout({ children }: { children: ReactNode }) {
  return <ModuloGuard codigoOpc="CLI">{children}</ModuloGuard>
}
