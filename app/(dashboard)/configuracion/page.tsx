'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  CheckSquareIcon,
  ClipboardTextIcon,
  CurrencyDollarIcon,
  GearIcon,
  StorefrontIcon,
  UsersIcon
} from '@phosphor-icons/react'
import Link from 'next/link'

interface ConfigModule {
  title: string
  description: string
  icon: React.ElementType
  color: string
  href: string
}

const configModules: ConfigModule[] = [
  {
    title: 'Tablas',
    description: 'Configuración de tablas del sistema',
    icon: ClipboardTextIcon,
    color: 'bg-emerald-500',
    href: '/configuracion/tablas'
  },
  {
    title: 'Tipo de Cambio',
    description: 'Gestión de tipos de cambio',
    icon: CurrencyDollarIcon,
    color: 'bg-orange-500',
    href: '/configuracion/tipo-cambio'
  },
  {
    title: 'Usuario',
    description: 'Administración de usuarios',
    icon: UsersIcon,
    color: 'bg-emerald-500',
    href: '/configuracion/usuario'
  },
  {
    title: 'Punto Venta',
    description: 'Configuración de puntos de venta',
    icon: StorefrontIcon,
    color: 'bg-emerald-500',
    href: '/configuracion/punto-venta'
  },
  {
    title: 'Asignar Opciones',
    description: 'Asignación de opciones a usuarios',
    icon: CheckSquareIcon,
    color: 'bg-orange-500',
    href: '/configuracion/asignar-opciones'
  },
  {
    title: 'Opciones Sistemas',
    description: 'Opciones generales del sistema',
    icon: GearIcon,
    color: 'bg-blue-500',
    href: '/configuracion/opciones-sistemas'
  }
]

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">
          Parámetros generales del sistema y preferencias de la aplicación.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {configModules.map((module) => {
          const Icon = module.icon
          return (
            <Link key={module.title} href={module.href}>
              <Card className="group cursor-pointer transition-all hover:shadow-md">
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
    </div>
  )
}
