import { ModuloGuard } from '@/components/modules/dashboard/modulo-guard'
import { ReactNode } from 'react'

export default async function PlanillasLayout({ children }: { children: ReactNode }) {
  return <ModuloGuard codigoOpc="PLN">{children}</ModuloGuard>
}
