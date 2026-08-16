'use client'

import { useMemo, useState } from 'react'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Controller, useForm } from 'react-hook-form'
import useSWR from 'swr'

import { listarCuentasPagarPorFiltroAction } from '@/actions/cuentas-pagar.actions'
import { obtenerMonedasAction, obtenerTiposDocumentoAction } from '@/actions/ventas.actions'
import { DatePicker } from '@/components/shared/date-picker'
import { ProveedorSearchCombobox } from '@/components/shared/proveedor-search-combobox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  cuentasPagarFormSchema,
  type CuentasPagarFormData
} from '@/validators/cuentas-pagar.schema'
import type {
  CuentaPagarPorRuc,
  CuentasPagarFiltro
} from '@/ventas/domain/entities/cuenta-pagar.entity'
import type { ProveedorSelectItem } from '@/ventas/domain/entities/proveedor.entity'
import type { SelectOption } from '@/ventas/domain/entities/select-option.entity'
import { MagnifyingGlassIcon, ReceiptIcon, XCircleIcon } from '@phosphor-icons/react'

const defaultValues: CuentasPagarFormData = {
  proveedor: '',
  direccion: '',
  ruc: '',
  tipoDcto: '',
  moneda: '',
  noDcto: '',
  fechaDcto: '',
  saldo: '',
  vctoDcto: ''
}

export function CuentasPagarClientPage() {
  const [busqueda, setBusqueda] = useState('')
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<ProveedorSelectItem | null>(
    null
  )
  const [filtroActivo, setFiltroActivo] = useState<CuentasPagarFiltro | null>(null)

  const { data: cuentas = [], isLoading: cargandoCuentas } = useSWR<CuentaPagarPorRuc[]>(
    filtroActivo ? (['cuentas-pagar', filtroActivo] as const) : null,
    async ([, f]: readonly [string, CuentasPagarFiltro]) => listarCuentasPagarPorFiltroAction(f)
  )

  const { data: tiposDocumento = [] } = useSWR<SelectOption[]>(
    'tipos-documento',
    obtenerTiposDocumentoAction
  )
  const { data: monedas = [] } = useSWR<SelectOption[]>('monedas', obtenerMonedasAction)

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<CuentasPagarFormData>({
    resolver: standardSchemaResolver(cuentasPagarFormSchema),
    defaultValues
  })

  function handleLimpiar() {
    reset(defaultValues)
    setProveedorSeleccionado(null)
    setFiltroActivo(null)
    setBusqueda('')
  }

  function handleBuscar(data: CuentasPagarFormData) {
    const saldoNum = data.saldo ? Number(data.saldo) : undefined
    setFiltroActivo({
      ruc: data.proveedor.trim(),
      tipoDocumento: data.tipoDcto || undefined,
      numeroDocumento: data.noDcto || undefined,
      fechaDocumento: data.fechaDcto || undefined,
      fechaVencimiento: data.vctoDcto || undefined,
      saldo: saldoNum !== undefined && !Number.isNaN(saldoNum) ? saldoNum : undefined
    })
  }

  function handleProveedorSeleccionado(proveedor: ProveedorSelectItem) {
    setProveedorSeleccionado(proveedor)
    setValue('proveedor', proveedor.ruc ?? '', { shouldValidate: true })
    setValue('ruc', proveedor.ruc ?? '', { shouldValidate: true })
    setValue('direccion', proveedor.direccion ?? '', { shouldValidate: true })
  }

  function handleTipoDctoChange(onChange: (value: string) => void) {
    return (value: string | null) => {
      if (value) onChange(value)
    }
  }

  function handleMonedaChange(onChange: (value: string) => void) {
    return (value: string | null) => {
      if (value) onChange(value)
    }
  }

  const cuentasFiltradas = useMemo(
    () =>
      cuentas.filter((c) => {
        const q = busqueda.toLowerCase()
        return (
          c.numDocumento.toLowerCase().includes(q) ||
          c.proveedor.toLowerCase().includes(q) ||
          c.tipoDocumento.toLowerCase().includes(q)
        )
      }),
    [cuentas, busqueda]
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Cargar Cuentas Corrientes por Pagar</h1>
        <p className="text-muted-foreground">Procesar y actualizar cuentas pendientes de pago.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Formulario */}
        <Card className="shadow-sm xl:col-span-5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ReceiptIcon className="size-5 text-primary" weight="duotone" />
              Datos de la Cuenta por Pagar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleBuscar)} className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="proveedor">Proveedor</Label>
                <Controller
                  name="proveedor"
                  control={control}
                  render={() => (
                    <ProveedorSearchCombobox
                      id="proveedor"
                      value={proveedorSeleccionado}
                      onValueChange={handleProveedorSeleccionado}
                      aria-invalid={!!errors.proveedor}
                    />
                  )}
                />
                {errors.proveedor && (
                  <p className="text-xs text-destructive">{errors.proveedor.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    placeholder="Dirección del proveedor"
                    aria-label="Dirección del proveedor"
                    {...register('direccion')}
                  />
                  {errors.direccion && (
                    <p className="text-xs text-destructive">{errors.direccion.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:w-48">
                  <Label htmlFor="ruc">R.U.C.</Label>
                  <Input
                    id="ruc"
                    placeholder="R.U.C."
                    aria-label="R.U.C. del proveedor"
                    {...register('ruc')}
                  />
                  {errors.ruc && <p className="text-xs text-destructive">{errors.ruc.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tipoDcto">Tipo Dcto.</Label>
                  <Controller
                    name="tipoDcto"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={handleTipoDctoChange(field.onChange)}
                      >
                        <SelectTrigger
                          id="tipoDcto"
                          aria-label="Tipo de documento"
                          className="w-full"
                        >
                          <SelectValue placeholder="Seleccionar...">
                            {(value: string | null) =>
                              tiposDocumento.find((t) => t.codigo === value)?.descripcion ?? ''
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {tiposDocumento.map((tipo) => (
                            <SelectItem key={tipo.codigo} value={tipo.codigo}>
                              {tipo.descripcion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.tipoDcto && (
                    <p className="text-xs text-destructive">{errors.tipoDcto.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="moneda">Moneda</Label>
                  <Controller
                    name="moneda"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={handleMonedaChange(field.onChange)}
                      >
                        <SelectTrigger id="moneda" aria-label="Moneda" className="w-full">
                          <SelectValue placeholder="Seleccionar...">
                            {(value: string | null) =>
                              monedas.find((m) => m.codigo === value)?.descripcion ?? ''
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {monedas.map((moneda) => (
                            <SelectItem key={moneda.codigo} value={moneda.codigo}>
                              {moneda.descripcion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.moneda && (
                    <p className="text-xs text-destructive">{errors.moneda.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="noDcto">No.Dcto.</Label>
                  <Input
                    id="noDcto"
                    placeholder="Número de documento"
                    aria-label="Número de documento"
                    {...register('noDcto')}
                  />
                  {errors.noDcto && (
                    <p className="text-xs text-destructive">{errors.noDcto.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Controller
                    name="fechaDcto"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        id="fechaDcto"
                        label="Fecha Dcto."
                        value={field.value ?? ''}
                        onChange={(v) => field.onChange(v)}
                        aria-invalid={!!errors.fechaDcto}
                      />
                    )}
                  />
                  {errors.fechaDcto && (
                    <p className="text-xs text-destructive">{errors.fechaDcto.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="saldo">Saldo</Label>
                  <Input
                    id="saldo"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    aria-label="Saldo pendiente"
                    {...register('saldo')}
                  />
                  {errors.saldo && (
                    <p className="text-xs text-destructive">{errors.saldo.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Controller
                    name="vctoDcto"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        id="vctoDcto"
                        label="Vcto Dcto."
                        value={field.value ?? ''}
                        onChange={(v) => field.onChange(v)}
                        aria-invalid={!!errors.vctoDcto}
                      />
                    )}
                  />
                  {errors.vctoDcto && (
                    <p className="text-xs text-destructive">{errors.vctoDcto.message}</p>
                  )}
                </div>
              </div>
              {/* Botones */}
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button type="button" variant="outline" onClick={handleLimpiar}>
                  <XCircleIcon className="mr-2 size-4" />
                  Cancelar
                </Button>
                <Button type="submit">
                  <MagnifyingGlassIcon className="mr-2 size-4" />
                  Buscar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Listado */}
        <Card className="shadow-sm xl:col-span-7">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cuentas por Pagar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por N° documento, proveedor o RUC..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9"
                aria-label="Buscar cuenta por pagar"
              />
            </div>

            <div className="rounded-md border">
              <div className="max-h-128 overflow-auto">
                <Table className="text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-table-header">
                    <TableRow>
                      <TableHead className="h-9  w-[15%]">Tipo</TableHead>
                      <TableHead className="h-9  w-[15%]">N° Documento</TableHead>
                      <TableHead className="h-9  w-auto">Proveedor</TableHead>
                      <TableHead className="h-9  w-[10%] text-right">Saldo</TableHead>
                      <TableHead className="h-9  w-[15%] text-center">Vencimiento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cargandoCuentas ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          Cargando...
                        </TableCell>
                      </TableRow>
                    ) : !filtroActivo ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          Presione Buscar para listar las cuentas por pagar. Todos los campos del
                          filtro son opcionales.
                        </TableCell>
                      </TableRow>
                    ) : cuentasFiltradas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          Sin resultados
                        </TableCell>
                      </TableRow>
                    ) : (
                      cuentasFiltradas.map((cuenta) => (
                        <TableRow
                          key={`${cuenta.tipoDocumento}-${cuenta.numDocumento}`}
                          className="hover:bg-table-row-hover"
                        >
                          <TableCell className="">{cuenta.tipoDocumento}</TableCell>
                          <TableCell className=" font-medium">{cuenta.numDocumento}</TableCell>
                          <TableCell className="">
                            <div className="truncate" title={cuenta.proveedor}>
                              {cuenta.proveedor}
                            </div>
                          </TableCell>
                          <TableCell className=" text-right font-mono">
                            {cuenta.saldo.toFixed(2)}
                          </TableCell>
                          <TableCell className=" text-center">{cuenta.vencimiento}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
