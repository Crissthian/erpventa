'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  AddressBookIcon,
  BankIcon,
  ClipboardTextIcon,
  CurrencyCircleDollarIcon,
  HandCoinsIcon,
  NoteIcon,
  ReceiptIcon,
  UserIcon
} from '@phosphor-icons/react'
import Link from 'next/link'

interface VentasModule {
  title: string
  description: string
  icon: React.ElementType
  color: string
  href: string
}

const ventasModules: VentasModule[] = [
  {
    title: 'Atención',
    description: 'Gestión de atención al cliente',
    icon: UserIcon,
    color: 'bg-orange-500',
    href: '/ventas/atencion'
  },
  {
    title: 'Cliente',
    description: 'Administración de clientes',
    icon: AddressBookIcon,
    color: 'bg-yellow-500',
    href: '/ventas/cliente'
  },
  {
    title: 'Admin. Ventas',
    description: 'Administración de ventas',
    icon: ClipboardTextIcon,
    color: 'bg-orange-500',
    href: '/ventas/admin'
  },
  {
    title: 'Cobran.',
    description: 'Gestión de cobranzas',
    icon: HandCoinsIcon,
    color: 'bg-yellow-500',
    href: '/ventas/cobranzas'
  },
  {
    title: 'Letras',
    description: 'Administración de letras',
    icon: ReceiptIcon,
    color: 'bg-orange-500',
    href: '/ventas/letras'
  },
  {
    title: 'Registro Venta',
    description: 'Registro de ventas',
    icon: BankIcon,
    color: 'bg-blue-500',
    href: '/ventas/registro'
  },
  {
    title: 'Notas',
    description: 'Notas de crédito y débito',
    icon: NoteIcon,
    color: 'bg-blue-500',
    href: '/ventas/notas'
  },
  {
    title: 'Cuenta Cte.',
    description: 'Cuenta corriente de clientes',
    icon: CurrencyCircleDollarIcon,
    color: 'bg-blue-500',
    href: '/ventas/cuenta-corriente'
  }
]

export default function VentasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ventas</h1>
        <p className="text-muted-foreground">
          Gestión de ventas, clientes y procesos comerciales del sistema ERP.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {ventasModules.map((module) => {
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
