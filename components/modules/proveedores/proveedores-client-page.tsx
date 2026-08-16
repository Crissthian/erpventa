'use client'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import useSWR from 'swr'

import {
  guardarProveedorAction,
  listarProveedoresAction,
  obtenerProveedorPorRucAction
} from '@/actions/proveedores.actions'
import {
  obtenerDistritosAction,
  obtenerTiposDocumentoAction,
  obtenerTiposProveedorAction
} from '@/actions/ventas.actions'
import { ProveedorRow } from '@/proveedores/domain/ports/proveedor-repository.port'
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
import { proveedorFormSchema, type ProveedorFormData } from '@/validators/proveedor.schema'
import {
  FloppyDiskIcon,
  MagnifyingGlassIcon,
  UsersThreeIcon,
  XCircleIcon
} from '@phosphor-icons/react'

const defaultValues: ProveedorFormData = {
  ruc: '',
  razonSocial: '',
  direccion: '',
  telefono: '',
  fax: '',
  correo: '',
  observaciones: '',
  distrito: '',
  inactivo: false,
  retencion: false,
  exterior: false,
  nombreProveedor: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  detraccion: false,
  tipoDocumento: '',
  tipoProveedor: '',
  percepcion: false
}

export function ProveedoresClientPage() {
  const [busqueda, setBusqueda] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [cargandoProveedor, setCargandoProveedor] = useState(false)
  const { data: distritos = [] } = useSWR<SelectOption[]>('distritos', obtenerDistritosAction)
  const { data: tiposDocumento = [] } = useSWR<SelectOption[]>(
    'tiposDocumento',
    obtenerTiposDocumentoAction
  )
  const { data: tiposProveedor = [] } = useSWR<SelectOption[]>(
    'tiposProveedor',
    obtenerTiposProveedorAction
  )
  const { data: proveedores = [], isLoading: cargandoLista, mutate } = useSWR<ProveedorRow[]>(
    'proveedores-lista',
    listarProveedoresAction
  )

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProveedorFormData>({
    resolver: standardSchemaResolver(proveedorFormSchema),
    defaultValues
  })

  const watchRuc = useWatch({
    control,
    name: 'ruc',
    defaultValue: ''
  })

  const proveedoresFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return proveedores
    return proveedores.filter(
      (p) =>
        p.ruc.includes(q) ||
        p.razonSocial.toLowerCase().includes(q) ||
        p.direccion.toLowerCase().includes(q)
    )
  }, [busqueda, proveedores])

  async function handleSelectProveedor(rucProveedor: string) {
    setCargandoProveedor(true)
    try {
      const prv = await obtenerProveedorPorRucAction(rucProveedor)
      if (prv) {
        reset({
          ruc: prv.ruc,
          razonSocial: prv.razonSocial,
          direccion: prv.direccion,
          telefono: prv.telefono || '',
          fax: prv.fax || '',
          correo: prv.correo || '',
          observaciones: prv.observaciones || '',
          distrito: prv.distrito || '',
          inactivo: prv.inactivo,
          retencion: prv.retencion,
          exterior: prv.exterior,
          nombreProveedor: prv.nombreProveedor || '',
          apellidoPaterno: prv.apellidoPaterno || '',
          apellidoMaterno: prv.apellidoMaterno || '',
          detraccion: prv.detraccion,
          tipoDocumento: prv.tipoDocumento || '',
          tipoProveedor: prv.tipoProveedor || '',
          percepcion: prv.percepcion
        })
        setIsEditing(true)
      } else {
        toast.error('No se encontraron los datos del proveedor seleccionado.')
      }
    } catch (err) {
      console.error('Error al cargar proveedor:', err)
      toast.error('Error al cargar los detalles del proveedor.')
    } finally {
      setCargandoProveedor(false)
    }
  }

  function limpiarFormulario() {
    reset(defaultValues)
    setIsEditing(false)
  }

  async function handleFormSubmit(data: ProveedorFormData) {
    setGuardando(true)
    const result = await guardarProveedorAction(data)
    setGuardando(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(
      isEditing ? 'Proveedor actualizado correctamente' : 'Proveedor creado correctamente'
    )
    mutate()
    limpiarFormulario()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            <UsersThreeIcon className="size-5" weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Maestro de Proveedores</h1>
            <p className="text-sm text-muted-foreground">
              Registro y consulta de proveedores, cuentas y datos de contacto.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="shadow-sm xl:col-span-5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Datos del Proveedor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="ruc">R.U.C.</Label>
                  <Input
                    id="ruc"
                    placeholder="20XXXXXXXXX"
                    maxLength={15}
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
                      name="inactivo"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="inactivo"
                          checked={field.value}
                          onCheckedChange={(val) => field.onChange(val === true)}
                        />
                      )}
                    />
                    Inactivo
                  </Label>
                  <Label className="flex items-center gap-2 text-xs font-normal">
                    <Controller
                      name="exterior"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="exterior"
                          checked={field.value}
                          onCheckedChange={(val) => field.onChange(val === true)}
                        />
                      )}
                    />
                    Exterior
                  </Label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="razonSocial">Razón Social</Label>
                <Input
                  id="razonSocial"
                  placeholder="Razón social del proveedor"
                  className="uppercase"
                  {...register('razonSocial')}
                />
                {errors.razonSocial && (
                  <p className="text-xs text-destructive">{errors.razonSocial.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nombreProveedor">Nombres</Label>
                  <Input
                    id="nombreProveedor"
                    placeholder="Nombres"
                    className="uppercase"
                    {...register('nombreProveedor')}
                  />
                  {errors.nombreProveedor && (
                    <p className="text-xs text-destructive">{errors.nombreProveedor.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="apellidoPaterno">Ape. Paterno</Label>
                  <Input
                    id="apellidoPaterno"
                    placeholder="Apellido paterno"
                    className="uppercase"
                    {...register('apellidoPaterno')}
                  />
                  {errors.apellidoPaterno && (
                    <p className="text-xs text-destructive">{errors.apellidoPaterno.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_2fr]">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="apellidoMaterno">Ape. Materno</Label>
                  <Input
                    id="apellidoMaterno"
                    placeholder="Apellido materno"
                    className="uppercase"
                    {...register('apellidoMaterno')}
                  />
                  {errors.apellidoMaterno && (
                    <p className="text-xs text-destructive">{errors.apellidoMaterno.message}</p>
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
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="distrito">Distrito</Label>
                  <Controller
                    name="distrito"
                    control={control}
                    render={({ field }) => {
                      const handleDistritoSelectChange = (val: string | null) => {
                        field.onChange(val || '')
                      }
                      return (
                        <Select value={field.value} onValueChange={handleDistritoSelectChange}>
                          <SelectTrigger id="distrito" className="w-full">
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
                <div className="flex flex-col gap-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" placeholder="(01) 000-0000" {...register('telefono')} />
                  {errors.telefono && (
                    <p className="text-xs text-destructive">{errors.telefono.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 rounded-md border bg-secondary/40 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex flex-col gap-1 w-full">
                    <Label htmlFor="fax" className="text-xs font-normal">
                      Fax
                    </Label>
                    <Input id="fax" placeholder="(01) 000-0000" {...register('fax')} />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <Label htmlFor="correo" className="text-xs font-normal">
                      Correo
                    </Label>
                    <Input id="correo" placeholder="Correo electrónico" {...register('correo')} />
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-xs min-w-32">
                  <span className="text-foreground">Afecto a</span>
                  <Label className="flex items-center gap-2 text-xs font-normal">
                    <Controller
                      name="retencion"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="afecto-retencion"
                          checked={field.value}
                          onCheckedChange={(val) => field.onChange(val === true)}
                        />
                      )}
                    />
                    Retención
                  </Label>
                  <Label className="flex items-center gap-2 text-xs font-normal">
                    <Controller
                      name="detraccion"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="afecto-detraccion"
                          checked={field.value}
                          onCheckedChange={(val) => field.onChange(val === true)}
                        />
                      )}
                    />
                    Detracción
                  </Label>
                  <Label className="flex items-center gap-2 text-xs font-normal">
                    <Controller
                      name="percepcion"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="afecto-percepcion"
                          checked={field.value}
                          onCheckedChange={(val) => field.onChange(val === true)}
                        />
                      )}
                    />
                    Percepción
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tipoDocumento">Tip Doc.</Label>
                  <Controller
                    name="tipoDocumento"
                    control={control}
                    render={({ field }) => {
                      const handleTipoDocumentoSelectChange = (val: string | null) => {
                        field.onChange(val || '')
                      }
                      return (
                        <Select value={field.value} onValueChange={handleTipoDocumentoSelectChange}>
                          <SelectTrigger id="tipoDocumento" className="w-full">
                            <SelectValue placeholder="Seleccionar...">
                              {(value: string | null) =>
                                tiposDocumento.find((t) => t.codigo === value)?.descripcion ??
                                'Seleccionar...'
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {tiposDocumento.map((item) => (
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
                  <Label htmlFor="tipoProveedor">Tip Prov.</Label>
                  <Controller
                    name="tipoProveedor"
                    control={control}
                    render={({ field }) => {
                      const handleTipoProveedorSelectChange = (val: string | null) => {
                        field.onChange(val || '')
                      }
                      return (
                        <Select value={field.value} onValueChange={handleTipoProveedorSelectChange}>
                          <SelectTrigger id="tipoProveedor" className="w-full">
                            <SelectValue placeholder="Seleccionar...">
                              {(value: string | null) =>
                                tiposProveedor.find((t) => t.codigo === value)?.descripcion ??
                                'Seleccionar...'
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {tiposProveedor.map((item) => (
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

              <div className="flex items-center justify-end gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={limpiarFormulario}
                  disabled={guardando || cargandoProveedor}
                >
                  <XCircleIcon className="mr-2 size-4" />
                  Cancelar
                </Button>
                <Button type="submit" disabled={guardando || cargandoProveedor}>
                  <FloppyDiskIcon className="mr-2 size-4" />
                  {guardando ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-sm xl:col-span-7">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Listado de Proveedores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por R.U.C., razón social o dirección..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9"
                aria-label="Buscar proveedor"
              />
            </div>

            <div className="rounded-md border">
              <div className="max-h-140 overflow-auto">
                <Table className="text-sm w-full">
                  <TableHeader className="sticky top-0 z-10 bg-table-header">
                    <TableRow>
                      <TableHead className="h-9 w-[15%]">R.U.C.</TableHead>
                      <TableHead className="h-9 w-[50%]">Razón Social</TableHead>
                      <TableHead className="h-9 w-[35%]">Dirección</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cargandoLista ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          Cargando proveedores...
                        </TableCell>
                      </TableRow>
                    ) : proveedoresFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          Sin resultados
                        </TableCell>
                      </TableRow>
                    ) : (
                      proveedoresFiltrados.map((proveedor) => (
                        <TableRow
                          key={proveedor.ruc}
                          className={`hover:bg-table-row-hover cursor-pointer ${
                            watchRuc === proveedor.ruc ? 'bg-primary/5 font-medium' : ''
                          }`}
                          onClick={() => handleSelectProveedor(proveedor.ruc)}
                        >
                          <TableCell className="font-mono text-xs max-w-0 truncate">
                            {proveedor.ruc}
                          </TableCell>
                          <TableCell
                            className="max-w-0 truncate uppercase"
                            title={proveedor.razonSocial}
                          >
                            {proveedor.razonSocial}
                          </TableCell>
                          <TableCell
                            className="max-w-0 truncate uppercase"
                            title={proveedor.direccion}
                          >
                            {proveedor.direccion}
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
