'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { CheckCircleIcon, DatabaseIcon } from '@phosphor-icons/react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { limpiarTablasMaestrasAction } from '@/actions/tablas.actions'
import { TABLAS_LIMPIEZA } from '@/configuracion/domain/entities/tabla.entity'

export default function MantenimientoTablasPage() {
  const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  const toggleTabla = (id: string) => {
    setSeleccionadas((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const seleccionarTodas = () => {
    const ids = TABLAS_LIMPIEZA.map((t) => t.id)
    const todasSeleccionadas = ids.every((id) => seleccionadas.has(id))
    setSeleccionadas((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => (todasSeleccionadas ? next.delete(id) : next.add(id)))
      return next
    })
  }

  const ejecutarMantenimiento = () => {
    if (seleccionadas.size === 0) {
      toast.warning('Seleccione al menos una tabla')
      return
    }

    startTransition(async () => {
      const result = await limpiarTablasMaestrasAction([...seleccionadas])
      if (result.error) {
        toast.error(result.error)
        return
      }

      const resumen = result.resultados
        ?.map((r) => `${r.label}: ${r.eliminados}`)
        .join(', ')
      toast.success(`Mantenimiento ejecutado en ${seleccionadas.size} tabla(s). ${resumen ?? ''}`)
      setSeleccionadas(new Set())
    })
  }

  const todasSeleccionadas = TABLAS_LIMPIEZA.every((t) => seleccionadas.has(t.id))

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Mantenimiento de Tablas</h1>
          <p className="text-muted-foreground">Optimizar y mantener las tablas del sistema.</p>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <DatabaseIcon className="size-5 text-primary" weight="duotone" />
              Seleccionar Tablas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm font-semibold">Tablas Maestras</span>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={seleccionarTodas}
              >
                {todasSeleccionadas ? 'Deseleccionar' : 'Seleccionar todas'}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2.5 pt-3 md:grid-cols-2">
              {TABLAS_LIMPIEZA.map((tabla) => (
                <div key={tabla.id} className="flex items-center gap-3">
                  <Checkbox
                    id={tabla.id}
                    checked={seleccionadas.has(tabla.id)}
                    onCheckedChange={() => toggleTabla(tabla.id)}
                  />
                  <Label htmlFor={tabla.id} className="text-sm cursor-pointer">
                    {tabla.label}
                  </Label>
                </div>
              ))}
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-2 pt-4 mt-6 border-t">
              <Button
                size="sm"
                onClick={ejecutarMantenimiento}
                disabled={seleccionadas.size === 0 || isPending}
              >
                <CheckCircleIcon className="size-4" weight="bold" />
                {isPending ? 'Ejecutando...' : 'Ejecutar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}