import { requireModuloAcceso } from '@/auth/permisos'
import { ReactNode } from 'react'

export async function ModuloGuard({
  codigoOpc,
  children
}: {
  codigoOpc: string
  children: ReactNode
}) {
  await requireModuloAcceso(codigoOpc)
  return <>{children}</>
}