'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { HouseIcon } from '@phosphor-icons/react'

const routeLabels: Record<string, string> = {
  ventas: 'Ventas',
  finanzas: 'Finanzas',
  contabilidad: 'Contabilidad',
  inventario: 'Inventario',
  proveedores: 'Proveedores',
  planillas: 'Planillas',
  costos: 'Costos',
  produccion: 'Producción',
  configuracion: 'Configuración',
  usuarios: 'Usuarios',
  roles: 'Roles',
  nuevo: 'Nuevo',
  editar: 'Editar',
  detalle: 'Detalle'
}

export function AppBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" render={<Link href="/" />} className="flex items-center gap-1">
            <HouseIcon className="h-4 w-4" weight="duotone" />
            Inicio
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`
          const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
          const isLast = index === segments.length - 1

          return (
            <div key={href} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href} render={<Link href={href} />}>
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
