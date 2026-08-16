'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import {
  AddressBookIcon,
  BankIcon,
  BookOpenIcon,
  ClipboardTextIcon,
  CurrencyCircleDollarIcon,
  CurrencyDollarIcon,
  FactoryIcon,
  GearIcon,
  HandCoinsIcon,
  MoneyIcon,
  NoteIcon,
  PackageIcon,
  ReceiptIcon,
  ShoppingCartIcon,
  UsersIcon
} from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const mainModules = [
  {
    title: 'Finanzas',
    href: '/finanzas',
    icon: CurrencyDollarIcon,
    description: 'Control financiero y tesorería',
    cdgOpc: 'TES'
  },
  {
    title: 'Contabilidad',
    href: '/contabilidad',
    icon: BookOpenIcon,
    description: 'Registro contable y reportes',
    cdgOpc: 'INT'
  },
  {
    title: 'Inventario',
    href: '/inventario',
    icon: PackageIcon,
    description: 'Control de stock y almacén',
    cdgOpc: 'ALM'
  },
  {
    title: 'Proveedores',
    href: '/proveedores',
    icon: UsersIcon,
    description: 'Gestión de proveedores',
    cdgOpc: 'PRV'
  },
  {
    title: 'Planillas',
    href: '/planillas',
    icon: ClipboardTextIcon,
    description: 'Nómina y remuneraciones',
    cdgOpc: 'PLN'
  },
  {
    title: 'Costos',
    href: '/costos',
    icon: MoneyIcon,
    description: 'Análisis y control de costos',
    cdgOpc: 'SIG'
  },
  {
    title: 'Producción',
    href: '/produccion',
    icon: FactoryIcon,
    description: 'Control de producción',
    cdgOpc: 'PRO'
  }
]

const ventasSubItems = [
  {
    title: 'Atención',
    href: '/ventas/atencion',
    icon: UsersIcon,
    description: 'Gestión de atención al cliente'
  },
  {
    title: 'Cliente',
    href: '/ventas/cliente',
    icon: AddressBookIcon,
    description: 'Administración de clientes'
  },
  {
    title: 'Admin. Ventas',
    href: '/ventas/admin',
    icon: ClipboardTextIcon,
    description: 'Administración de ventas'
  },
  {
    title: 'Cobranzas',
    href: '/ventas/cobranzas',
    icon: HandCoinsIcon,
    description: 'Gestión de cobranzas'
  },
  {
    title: 'Letras',
    href: '/ventas/letras',
    icon: ReceiptIcon,
    description: 'Administración de letras'
  },
  {
    title: 'Registro Venta',
    href: '/ventas/registro',
    icon: BankIcon,
    description: 'Registro de ventas'
  },
  {
    title: 'Notas',
    href: '/ventas/notas',
    icon: NoteIcon,
    description: 'Notas de crédito y débito'
  },
  {
    title: 'Cuenta Cte.',
    href: '/ventas/cuenta-corriente',
    icon: CurrencyCircleDollarIcon,
    description: 'Cuenta corriente de clientes'
  }
]

const configItems = [
  {
    title: 'Tablas',
    href: '/configuracion/tablas',
    description: 'Configuración de tablas del sistema'
  },
  {
    title: 'Tipo de Cambio',
    href: '/configuracion/tipo-cambio',
    description: 'Gestión de tipos de cambio'
  },
  {
    title: 'Usuario',
    href: '/configuracion/usuario',
    description: 'Administración de usuarios'
  },
  {
    title: 'Punto Venta',
    href: '/configuracion/punto-venta',
    description: 'Configuración de puntos de venta'
  },
  {
    title: 'Asignar Opciones',
    href: '/configuracion/asignar-opciones',
    description: 'Asignación de opciones a usuarios'
  },
  {
    title: 'Opciones Sistemas',
    href: '/configuracion/opciones-sistemas',
    description: 'Opciones generales del sistema'
  }
]

export function Navbar({ modulosPermitidos }: { modulosPermitidos: string[] }) {
  const pathname = usePathname()
  const permitidos = new Set(modulosPermitidos)

  const ventasPermitido = permitidos.has('CLI')
  const configPermitido = permitidos.has('CNF')

  const itemBaseClass =
    'inline-flex h-9 w-max items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 gap-2 cursor-pointer'

  const ventasActive =
    pathname.startsWith('/ventas') ||
    pathname.startsWith('/configuracion/opciones-sistemas/cuentas-')

  const isConfigActive = pathname.startsWith('/configuracion') && !ventasActive

  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger
            disabled={!ventasPermitido}
            className={cn(
              itemBaseClass,
              ventasActive && ventasPermitido
                ? 'bg-header-foreground/15 text-header-foreground font-semibold'
                : 'text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/10',
              'data-popup-open:bg-header-foreground/15 data-popup-open:text-header-foreground data-popup-open:hover:bg-header-foreground/15 data-open:bg-header-foreground/15 data-open:text-header-foreground data-open:hover:bg-header-foreground/15'
            )}
          >
            <ShoppingCartIcon className="h-4 w-4" weight="duotone" />
            Ventas
          </NavigationMenuTrigger>
          {ventasPermitido && (
            <NavigationMenuContent className="bg-popover p-2 ring-1 ring-border rounded-lg">
              <ul className="grid w-100 gap-1.5 md:w-125 md:grid-cols-2 lg:w-150">
                {ventasSubItems.map((item) => {
                  const Icon = item.icon
                  const isSubItemActive = pathname === item.href
                  return (
                    <li key={item.title}>
                      <NavigationMenuLink
                        href={item.href}
                        render={<Link href={item.href} />}
                        className={cn(
                          'flex items-start gap-2.5 rounded-md p-2.5 leading-none no-underline outline-none transition-colors',
                          isSubItemActive
                            ? 'bg-primary/12 text-primary font-medium'
                            : 'text-foreground/75 hover:bg-primary/8 hover:text-primary focus:bg-primary/8 focus:text-primary'
                        )}
                      >
                        <Icon className="mt-0.5 size-4 shrink-0" weight="duotone" />
                        <div className="space-y-1">
                          <div className="text-sm font-medium leading-none">{item.title}</div>
                          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </NavigationMenuLink>
                    </li>
                  )
                })}
              </ul>
            </NavigationMenuContent>
          )}
        </NavigationMenuItem>
        {mainModules.map((module) => {
          const Icon = module.icon
          const isActive = pathname === module.href || pathname.startsWith(module.href + '/')
          const permitido = permitidos.has(module.cdgOpc)
          return (
            <NavigationMenuItem key={module.title}>
              {permitido ? (
                <NavigationMenuLink
                  href={module.href}
                  render={<Link href={module.href} />}
                  className={cn(
                    itemBaseClass,
                    isActive
                      ? 'bg-header-foreground/15 text-header-foreground font-semibold'
                      : 'text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/10'
                  )}
                >
                  <Icon className="h-4 w-4" weight="duotone" />
                  {module.title}
                </NavigationMenuLink>
              ) : (
                <span
                  aria-disabled="true"
                  className={cn(
                    itemBaseClass,
                    'pointer-events-none opacity-50 text-header-foreground/80'
                  )}
                >
                  <Icon className="h-4 w-4" weight="duotone" />
                  {module.title}
                </span>
              )}
            </NavigationMenuItem>
          )
        })}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            disabled={!configPermitido}
            className={cn(
              itemBaseClass,
              isConfigActive && configPermitido
                ? 'bg-header-foreground/15 text-header-foreground font-semibold'
                : 'text-header-foreground/80 hover:text-header-foreground hover:bg-header-foreground/10',
              'data-popup-open:bg-header-foreground/15 data-popup-open:text-header-foreground data-popup-open:hover:bg-header-foreground/15 data-open:bg-header-foreground/15 data-open:text-header-foreground data-open:hover:bg-header-foreground/15'
            )}
          >
            <GearIcon className="h-4 w-4" weight="duotone" />
            Configuración
          </NavigationMenuTrigger>
          {configPermitido && (
            <NavigationMenuContent className="bg-popover p-2 ring-1 ring-border rounded-lg">
              <ul className="grid w-100 gap-1.5 md:w-125 md:grid-cols-2 lg:w-150">
                {configItems.map((item) => {
                  const isSubItemActive = pathname === item.href
                  return (
                    <li key={item.title}>
                      <NavigationMenuLink
                        href={item.href}
                        render={<Link href={item.href} />}
                        className={cn(
                          'block select-none space-y-1 rounded-md p-2.5 leading-none no-underline outline-none transition-colors',
                          isSubItemActive
                            ? 'bg-primary/12 text-primary font-medium'
                            : 'text-foreground/75 hover:bg-primary/8 hover:text-primary focus:bg-primary/8 focus:text-primary'
                        )}
                      >
                        <div className="text-sm font-medium leading-none">{item.title}</div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          {item.description}
                        </p>
                      </NavigationMenuLink>
                    </li>
                  )
                })}
              </ul>
            </NavigationMenuContent>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
