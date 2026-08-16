import { AppBreadcrumb } from '@/components/layout/app-breadcrumb'
import { Navbar } from '@/components/layout/navbar'
import { LogoutButton } from '@/components/modules/auth/logout-button'
import { UserDisplay } from '@/components/modules/auth/user-display'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { obtenerModulosPermitidos } from '@/lib/auth/permisos'
import { getSession } from '@/lib/auth/session'
import { ReactNode } from 'react'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const [session, modulosPermitidos] = await Promise.all([getSession(), obtenerModulosPermitidos()])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b border-header-border bg-header px-6">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-semibold text-header-foreground">ERPVenta</h1>
          <Navbar modulosPermitidos={modulosPermitidos} />
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserDisplay name={session?.name ?? ''} />
          <LogoutButton />
        </div>
      </header>
      <div className="border-b border-border bg-card px-6 py-3">
        <AppBreadcrumb />
      </div>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
