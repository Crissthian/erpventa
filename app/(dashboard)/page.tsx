import { getSession } from '@/lib/auth/session'
import { obtenerModulosPermitidos } from '@/lib/auth/permisos'
import { ModuleGrid } from '@/components/modules/dashboard/module-grid'

export default async function DashboardPage() {
  const [session, modulosPermitidos] = await Promise.all([getSession(), obtenerModulosPermitidos()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bienvenido, {session?.name}</h1>
        <p className="text-muted-foreground">Panel principal del sistema ERP</p>
      </div>
      <ModuleGrid modulosPermitidos={modulosPermitidos} />
    </div>
  )
}
