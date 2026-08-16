'use client'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import useSWR from 'swr'

import {
  actualizarClienteAction,
  crearClienteAction,
  obtenerClientesAction,
  obtenerCondicionesPagoAction,
  obtenerDistritosAction,
  obtenerProvinciasAction,
  obtenerTiposClienteAction,
  obtenerVendedoresAction
} from '@/actions/ventas.actions'
import { Cliente } from '@/ventas/domain/entities/cliente.entity'
import { SelectOption } from '@/ventas/domain/entities/select-option.entity'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { clienteSchema } from '@/validators/cliente.schema'
import {
  AddressBookIcon,
  FloppyDiskIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XCircleIcon
} from '@phosphor-icons/react'
import { z } from 'zod'

type ClienteFormInput = z.input<typeof clienteSchema>

const defaultValues: ClienteFormInput = {
  ruc: '',
  razonSocial: '',
  direccion: '',
  telefono: '',
  fax: '',
  activo: 1,
  codigoProvincia: '',
  codigoDistrito: '',
  codigoTipoCliente: '',
  codigoCondicionPago: '',
  codigoVendedor: ''
}

export function ClienteClientPage() {
  const [busqueda, setBusqueda] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [cargandoCliente, setCargandoCliente] = useState(false)

  const { data: provincias = [] } = useSWR<SelectOption[]>('provincias', obtenerProvinciasAction)
  const { data: distritos = [] } = useSWR<SelectOption[]>('distritos', obtenerDistritosAction)
  const { data: tiposCliente = [] } = useSWR<SelectOption[]>(
    'tipos-cliente',
    obtenerTiposClienteAction
  )
  const { data: vendedores = [] } = useSWR<SelectOption[]>('vendedores', obtenerVendedoresAction)
  const { data: condicionesPago = [] } = useSWR<SelectOption[]>(
    'condiciones-pago',
    obtenerCondicionesPagoAction
  )

  const {
    data: clientes = [],
    isLoading: loading,
    mutate: refreshClientes
  } = useSWR<Cliente[]>('clientes', obtenerClientesAction)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ClienteFormInput>({
    resolver: standardSchemaResolver(clienteSchema),
    defaultValues
  })

  const watchRuc = useWatch({
    control,
    name: 'ruc',
    defaultValue: ''
  })

  const filteredClientes = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return clientes
    return clientes.filter((c) => c.ruc.includes(q) || c.razonSocial.toLowerCase().includes(q))
  }, [busqueda, clientes])

  function handleSelectCliente(cliente: Cliente) {
    setCargandoCliente(true)
    try {
      reset({
        ruc: cliente.ruc,
        razonSocial: cliente.razonSocial,
        direccion: cliente.direccion || '',
        telefono: cliente.telefono || '',
        fax: cliente.fax || '',
        activo: cliente.activo,
        codigoProvincia: cliente.codigoProvincia || '',
        codigoDistrito: cliente.codigoDistrito || '',
        codigoTipoCliente: cliente.codigoTipoCliente || '',
        codigoCondicionPago: cliente.codigoCondicionPago || '',
        codigoVendedor: cliente.codigoVendedor || ''
      })
      setIsEditing(true)
    } catch (err) {
      console.error('Error al cargar cliente:', err)
      toast.error('Error al cargar los detalles del cliente.')
    } finally {
      setCargandoCliente(false)
    }
  }

  function limpiarFormulario() {
    reset(defaultValues)
    setIsEditing(false)
  }

  async function handleFormSubmit(data: ClienteFormInput) {
    setGuardando(true)

    const formData = new FormData()
    formData.append('ruc', data.ruc)
    formData.append('razonSocial', data.razonSocial)
    formData.append('direccion', data.direccion || '')
    formData.append('telefono', data.telefono || '')
    formData.append('fax', data.fax || '')
    formData.append('activo', String(data.activo))
    formData.append('codigoProvincia', data.codigoProvincia || '')
    formData.append('codigoDistrito', data.codigoDistrito || '')
    formData.append('codigoTipoCliente', data.codigoTipoCliente || '')
    formData.append('codigoCondicionPago', data.codigoCondicionPago || '')
    formData.append('codigoVendedor', data.codigoVendedor || '')

    let result
    if (isEditing) {
      result = await actualizarClienteAction(null, formData)
    } else {
      result = await crearClienteAction(null, formData)
    }

    setGuardando(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(isEditing ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente')
    refreshClientes()
    limpiarFormulario()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            <AddressBookIcon className="size-5" weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Clientes</h1>
            <p className="text-sm text-muted-foreground">
              Mantenimiento y consulta de la cartera de clientes.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="shadow-sm xl:col-span-5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Datos del Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="ruc">R.U.C.</Label>
                  <Input
                    id="ruc"
                    placeholder="20XXXXXXXXX"
                    maxLength={11}
                    {...register('ruc')}
                    readOnly={isEditing}
                    className={
                      isEditing
                        ? 'bg-secondary/50 cursor-not-allowed font-mono text-sm'
                        : 'font-mono text-sm'
                    }
                  />
                  {errors.ruc && <p className="text-xs text-destructive">{errors.ruc.message}</p>}
                </div>
                <div className="flex items-center gap-4 pb-1">
                  <Label className="flex items-center gap-2 text-xs font-normal">
                    <Controller
                      name="activo"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="activo"
                          checked={field.value === 1}
                          onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                        />
                      )}
                    />
                    Activo
                  </Label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="razonSocial">Razón Social</Label>
                <Input
                  id="razonSocial"
                  placeholder="Razón social del cliente"
                  className="uppercase"
                  {...register('razonSocial')}
                />
                {errors.razonSocial && (
                  <p className="text-xs text-destructive">{errors.razonSocial.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  placeholder="Av. / Jr. / Calle"
                  className="uppercase"
                  {...register('direccion')}
                />
                {errors.direccion && (
                  <p className="text-xs text-destructive">{errors.direccion.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="codigoProvincia">Provincia</Label>
                  <Controller
                    name="codigoProvincia"
                    control={control}
                    render={({ field }) => {
                      const handleProvinciaSelectChange = (val: string | null) => {
                        field.onChange(val || '')
                      }
                      return (
                        <Select value={field.value} onValueChange={handleProvinciaSelectChange}>
                          <SelectTrigger id="codigoProvincia" className="w-full">
                            <SelectValue placeholder="Seleccionar...">
                              {(value: string | null) =>
                                provincias.find((p) => p.codigo === value)?.descripcion ??
                                'Seleccionar...'
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {provincias.map((item) => (
                              <SelectItem key={item.codigo} value={item.codigo}>
                                {item.descripcion}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="codigoDistrito">Distrito</Label>
                  <Controller
                    name="codigoDistrito"
                    control={control}
                    render={({ field }) => {
                      const handleDistritoSelectChange = (val: string | null) => {
                        field.onChange(val || '')
                      }
                      return (
                        <Select value={field.value} onValueChange={handleDistritoSelectChange}>
                          <SelectTrigger id="codigoDistrito" className="w-full">
                            <SelectValue placeholder="Seleccionar...">
                              {(value: string | null) =>
                                distritos.find((d) => d.codigo === value)?.descripcion ??
                                'Seleccionar...'
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {distritos.map((item) => (
                              <SelectItem key={item.codigo} value={item.codigo}>
                                {item.descripcion}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" placeholder="Teléfono" {...register('telefono')} />
                  {errors.telefono && (
                    <p className="text-xs text-destructive">{errors.telefono.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fax">Fax</Label>
                  <Input id="fax" placeholder="Fax" {...register('fax')} />
                  {errors.fax && <p className="text-xs text-destructive">{errors.fax.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="codigoTipoCliente">Tipo Cliente</Label>
                  <Controller
                    name="codigoTipoCliente"
                    control={control}
                    render={({ field }) => {
                      const handleTipoClienteSelectChange = (val: string | null) => {
                        field.onChange(val || '')
                      }
                      return (
                        <Select value={field.value} onValueChange={handleTipoClienteSelectChange}>
                          <SelectTrigger id="codigoTipoCliente" className="w-full">
                            <SelectValue placeholder="Seleccionar...">
                              {(value: string | null) =>
                                tiposCliente.find((t) => t.codigo === value)?.descripcion ??
                                'Seleccionar...'
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {tiposCliente.map((item) => (
                              <SelectItem key={item.codigo} value={item.codigo}>
                                {item.descripcion}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="codigoCondicionPago">Condición de Pago</Label>
                  <Controller
                    name="codigoCondicionPago"
                    control={control}
                    render={({ field }) => {
                      const handleCondicionPagoSelectChange = (val: string | null) => {
                        field.onChange(val || '')
                      }
                      return (
                        <Select value={field.value} onValueChange={handleCondicionPagoSelectChange}>
                          <SelectTrigger id="codigoCondicionPago" className="w-full">
                            <SelectValue placeholder="Seleccionar...">
                              {(value: string | null) =>
                                condicionesPago.find((c) => c.codigo === value)?.descripcion ??
                                'Seleccionar...'
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {condicionesPago.map((item) => (
                              <SelectItem key={item.codigo} value={item.codigo}>
                                {item.descripcion}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="codigoVendedor">Vendedor</Label>
                <Controller
                  name="codigoVendedor"
                  control={control}
                  render={({ field }) => {
                    const handleVendedorSelectChange = (val: string | null) => {
                      field.onChange(val || '')
                    }
                    return (
                      <Select value={field.value} onValueChange={handleVendedorSelectChange}>
                        <SelectTrigger id="codigoVendedor" className="w-full">
                          <SelectValue placeholder="Seleccionar...">
                            {(value: string | null) =>
                              vendedores.find((v) => v.codigo === value)?.descripcion ??
                              'Seleccionar...'
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {vendedores.map((item) => (
                            <SelectItem key={item.codigo} value={item.codigo}>
                              {item.descripcion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={limpiarFormulario}
                  disabled={guardando || cargandoCliente}
                >
                  <XCircleIcon className="mr-2 size-4" />
                  Cancelar
                </Button>
                <Button type="submit" disabled={guardando || cargandoCliente}>
                  <FloppyDiskIcon className="mr-2 size-4" />
                  {guardando ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-sm xl:col-span-7">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Listado de Clientes</CardTitle>
              <Button variant="default" size="sm" onClick={limpiarFormulario}>
                <PlusIcon className="size-4" />
                Nuevo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por R.U.C. o razón social..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9"
                aria-label="Buscar cliente"
              />
            </div>

            <div className="rounded-md border">
              <div className="max-h-140 overflow-auto">
                <Table className="text-sm w-full">
                  <TableHeader className="sticky top-0 z-10 bg-table-header">
                    <TableRow>
                      <TableHead className="h-9 w-[20%]">R.U.C.</TableHead>
                      <TableHead className="h-9 w-[40%]">Razón Social</TableHead>
                      <TableHead className="h-9 w-[40%]">Dirección</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          Cargando clientes...
                        </TableCell>
                      </TableRow>
                    ) : filteredClientes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          Sin resultados
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClientes.map((cliente) => (
                        <TableRow
                          key={cliente.ruc}
                          className={`hover:bg-table-row-hover cursor-pointer ${
                            watchRuc === cliente.ruc ? 'bg-primary/5 font-medium' : ''
                          }`}
                          onClick={() => handleSelectCliente(cliente)}
                        >
                          <TableCell className="font-mono text-xs max-w-0 truncate">
                            {cliente.ruc}
                          </TableCell>
                          <TableCell
                            className="max-w-0 truncate uppercase"
                            title={cliente.razonSocial}
                          >
                            {cliente.razonSocial}
                          </TableCell>
                          <TableCell
                            className="max-w-0 truncate uppercase"
                            title={cliente.direccion}
                          >
                            {cliente.direccion || '-'}
                          </TableCell>
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
