'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BankIcon,
  CreditCardIcon,
  DatabaseIcon,
  GearIcon,
  ListIcon,
  TrashIcon
} from '@phosphor-icons/react'
import Link from 'next/link'

interface OpcionSistema {
  id: string
  nombre: string
  descripcion: string
  icono: React.ElementType
  href: string
}

const opcionesSistema: OpcionSistema[] = [
  {
    id: 'cuentas-cobrar',
    nombre: 'Cargar Cuentas por Cobrar',
    descripcion: 'Procesar y actualizar cuentas pendientes de cobro',
    icono: CreditCardIcon,
    href: '/configuracion/opciones-sistemas/cuentas-cobrar'
  },
  {
    id: 'cuentas-pagar',
    nombre: 'Cargar Cuentas por Pagar',
    descripcion: 'Procesar y actualizar cuentas pendientes de pago',
    icono: BankIcon,
    href: '/configuracion/opciones-sistemas/cuentas-pagar'
  },
  {
    id: 'mantenimiento-tablas',
    nombre: 'Mantenimiento de Tablas',
    descripcion: 'Optimizar y mantener las tablas del sistema',
    icono: DatabaseIcon,
    href: '/configuracion/opciones-sistemas/mantenimiento-tablas'
  },
  {
    id: 'opciones-sistema',
    nombre: 'Opciones del Sistema',
    descripcion: 'Configurar parámetros generales del sistema',
    icono: GearIcon,
    href: '/configuracion/opciones-sistemas/opciones-sistema'
  },
  {
    id: 'comandos-mandatos',
    nombre: 'Comandos y Mandatos',
    descripcion: 'Gestionar comandos y procesos del sistema',
    icono: ListIcon,
    href: '/configuracion/opciones-sistemas/comandos-mandatos'
  },
  {
    id: 'eliminacion-documentos',
    nombre: 'Eliminación de Documentos',
    descripcion: 'Eliminar documentos obsoletos o temporales',
    icono: TrashIcon,
    href: '/configuracion/opciones-sistemas/eliminacion-documentos'
  }
]

export default function OpcionesSistemasPage() {
  return (
    <div className="flex justify-center">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Opciones del Sistema</h1>
          <p className="text-muted-foreground">
            Gestión de procesos y configuración general del sistema.
          </p>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <GearIcon className="size-5 text-primary" weight="duotone" />
              Opciones Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-w-2xl">
          {opcionesSistema.map((opcion) => {
            const Icon = opcion.icono
            return (
              <Link key={opcion.id} href={opcion.href}>
                <Button
                  variant="ghost"
                  className="h-auto w-full justify-start gap-3 p-4"
                >
                  <Icon className="size-5 text-muted-foreground" weight="duotone" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{opcion.nombre}</span>
                    <span className="text-xs text-muted-foreground">{opcion.descripcion}</span>
                  </div>
                </Button>
              </Link>
            )
          })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
