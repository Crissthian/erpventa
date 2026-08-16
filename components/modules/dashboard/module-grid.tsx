'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  BookOpenIcon,
  ClipboardTextIcon,
  CurrencyDollarIcon,
  FactoryIcon,
  GearIcon,
  MoneyIcon,
  PackageIcon,
  UsersIcon
} from '@phosphor-icons/react'
import { ShoppingCartIcon } from '@phosphor-icons/react/dist/ssr/ShoppingCart'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ModuleItem {
  title: string
  description: string
  icon: React.ElementType
  color: string
  href: string
  cdgOpc: string
}

const modules: ModuleItem[] = [
  {
    title: 'Ventas',
    description: 'Gestión de ventas y clientes',
    icon: ShoppingCartIcon,
    color: 'bg-green-600',
    href: '/ventas',
    cdgOpc: 'CLI'
  },
  {
    title: 'Finanzas',
    description: 'Control financiero y tesorería',
    icon: CurrencyDollarIcon,
    color: 'bg-red-600',
    href: '/finanzas',
    cdgOpc: 'TES'
  },
  {
    title: 'Contabilidad',
    description: 'Registro contable y reportes',
    icon: BookOpenIcon,
    color: 'bg-violet-700',
    href: '/contabilidad',
    cdgOpc: 'INT'
  },
  {
    title: 'Inventario',
    description: 'Control de stock y almacén',
    icon: PackageIcon,
    color: 'bg-teal-600',
    href: '/inventario',
    cdgOpc: 'ALM'
  },
  {
    title: 'Proveedores',
    description: 'Gestión de proveedores',
    icon: UsersIcon,
    color: 'bg-blue-600',
    href: '/proveedores',
    cdgOpc: 'PRV'
  },
  {
    title: 'Planillas',
    description: 'Nómina y remuneraciones',
    icon: ClipboardTextIcon,
    color: 'bg-pink-600',
    href: '/planillas',
    cdgOpc: 'PLN'
  },
  {
    title: 'Costos',
    description: 'Análisis y control de costos',
    icon: MoneyIcon,
    color: 'bg-amber-600',
    href: '/costos',
    cdgOpc: 'SIG'
  },
  {
    title: 'Configuración',
    description: 'Parámetros del sistema',
    icon: GearIcon,
    color: 'bg-slate-600',
    href: '/configuracion',
    cdgOpc: 'CNF'
  },
  {
    title: 'Producción',
    description: 'Control de producción',
    icon: FactoryIcon,
    color: 'bg-orange-600',
    href: '/produccion',
    cdgOpc: 'PRO'
  }
]

export function ModuleGrid({ modulosPermitidos }: { modulosPermitidos: string[] }) {
  const permitidos = new Set(modulosPermitidos)

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {modules.map((module) => {
        const Icon = module.icon
        const permitido = permitidos.has(module.cdgOpc)
        return (
          <Link
            key={module.title}
            href={module.href}
            aria-disabled={!permitido}
            className={cn(!permitido && 'pointer-events-none')}
          >
            <Card
              className={cn(
                'group transition-all',
                permitido ? 'cursor-pointer hover:shadow-md' : 'opacity-50'
              )}
            >
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-lg ${module.color} text-white shadow-sm transition-transform group-hover:scale-105`}
                >
                  <Icon className="h-7 w-7" weight="duotone" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{module.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{module.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
