'use client'

import {
  guardarTipoCambioAction,
  obtenerHistorialTipoCambioAction
} from '@/actions/tipo-cambio.actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ChartLineUpIcon, CheckIcon, CurrencyDollarIcon } from '@phosphor-icons/react'
import { useState } from 'react'

function fechaLocalHoy(): string {
  return new Date().toLocaleDateString('en-CA')
}

export default function TipoCambioPage() {
  const fecha = fechaLocalHoy()
  const [venta, setVenta] = useState('')
  const [compra, setCompra] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [bloqueado, setBloqueado] = useState(false)

  const [historialOpen, setHistorialOpen] = useState(false)
  const [historial, setHistorial] = useState<{ fecha: string; venta: number; compra: number }[]>([])
  const [cargandoHistorial, setCargandoHistorial] = useState(false)

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setExito('')
    setGuardando(true)

    const fd = new FormData()
    fd.append('venta', venta)
    fd.append('compra', compra)

    const resultado = await guardarTipoCambioAction(null, fd)
    setGuardando(false)

    if (resultado.error) {
      setError(resultado.error)
      return
    }

    setBloqueado(true)
    setExito('Tipo de cambio guardado correctamente')
  }

  async function abrirHistorial() {
    setHistorialOpen(true)
    setCargandoHistorial(true)
    const resultado = await obtenerHistorialTipoCambioAction()
    setHistorial(resultado)
    setCargandoHistorial(false)
  }

  return (
    <div className="flex justify-center">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Tipo de Cambio</h1>
          <p className="text-muted-foreground">Gestión de tipos de cambio y monedas del sistema.</p>
        </div>

        <form onSubmit={handleGuardar}>
          <Card className="shadow-sm max-w-xl">
            <CardHeader className="pb-2">
              <CardTitle>Tipo de Cambio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-[1fr_auto] gap-6 items-start">
                <div className="space-y-4">
                  <div className="grid grid-cols-[5rem_1fr] items-center gap-3">
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={fecha}
                      aria-label="Fecha del tipo de cambio"
                      disabled
                      required
                    />
                  </div>

                  <div className="grid grid-cols-[5rem_1fr] items-center gap-3">
                    <Label htmlFor="venta">Venta</Label>
                    <Input
                      id="venta"
                      type="number"
                      step="0.001"
                      min="0"
                      placeholder="0.000"
                      value={venta}
                      onChange={(e) => {
                        setVenta(e.target.value)
                        setBloqueado(false)
                      }}
                      aria-label="Tipo de cambio venta"
                      disabled={guardando}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-[5rem_1fr] items-center gap-3">
                    <Label htmlFor="compra">Compra</Label>
                    <Input
                      id="compra"
                      type="number"
                      step="0.001"
                      min="0"
                      placeholder="0.000"
                      value={compra}
                      onChange={(e) => {
                        setCompra(e.target.value)
                        setBloqueado(false)
                      }}
                      aria-label="Tipo de cambio compra"
                      disabled={guardando}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center w-28 h-28 rounded-lg bg-primary/10 text-primary">
                  <CurrencyDollarIcon className="size-16" weight="duotone" />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {exito && <p className="text-sm text-success">{exito}</p>}

              <div className="flex justify-start gap-2 pt-4 border-t">
                <Button type="submit" disabled={guardando || bloqueado}>
                  <CheckIcon className="size-4" />
                  Guardar
                </Button>
                <Button type="button" variant="outline" onClick={abrirHistorial}>
                  <ChartLineUpIcon className="size-4" />
                  Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        <Dialog open={historialOpen} onOpenChange={setHistorialOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Histórico de Tipo de Cambio</DialogTitle>
              <DialogDescription>Listado de tipos de cambio registrados.</DialogDescription>
            </DialogHeader>

            <div className="border rounded-md max-h-96 overflow-y-auto">
              <Table className="text-sm">
                <TableHeader className="sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="h-9 ">Fecha</TableHead>
                    <TableHead className="h-9  text-right">Venta</TableHead>
                    <TableHead className="h-9  text-right">Compra</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cargandoHistorial ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : historial.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        Sin registros
                      </TableCell>
                    </TableRow>
                  ) : (
                    historial.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="">{item.fecha}</TableCell>
                        <TableCell className=" text-right">{item.venta.toFixed(3)}</TableCell>
                        <TableCell className=" text-right">{item.compra.toFixed(3)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
