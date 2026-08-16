'use client'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import useSWR from 'swr'

import {
  guardarProductoAction,
  listarProductosConLineaAction,
  obtenerProductoPorCodigoAction
} from '@/actions/inventario.actions'
import {
  obtenerLineasAction,
  obtenerProcedenciasAction,
  obtenerSiguienteCodigoProductoAction,
  obtenerSubFamiliasAction,
  obtenerTiposProductoAction,
  obtenerUnidadesMedidaAction
} from '@/actions/ventas.actions'
import { formatDate } from '@/core/utils/date'
import { ProductoRow } from '@/inventario/domain/ports/producto-repository.port'
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
import { productoFormSchema, type ProductoFormData } from '@/validators/producto.schema'
import {
  FloppyDiskIcon,
  MagnifyingGlassIcon,
  PackageIcon,
  XCircleIcon
} from '@phosphor-icons/react'

const defaultValues: ProductoFormData = {
  codigo: '',
  linea: '',
  activo: true,
  cEquivalente: '',
  codBarra: '',
  abreviatura: '',
  descripcion: '',
  afecto: true,
  volumen: 0,
  peso: 0,
  destVenta: true,
  destCompra: true,
  tipo: '',
  procedencia: '',
  subFamilia: '',
  undMedida: '',
  valorSoles: 0,
  valorDolares: 0
}

export function InventarioClientPage() {
  const [busqueda, setBusqueda] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [cargandoProducto, setCargandoProducto] = useState(false)
  const [auditInfo, setAuditInfo] = useState<{
    usuario?: string
    fecha?: string
    hora?: string
  } | null>(null)

  const { data: lineas = [] } = useSWR<SelectOption[]>('lineas', obtenerLineasAction)
  const { data: tipos = [] } = useSWR<SelectOption[]>('tiposProducto', obtenerTiposProductoAction)
  const { data: procedencias = [] } = useSWR<SelectOption[]>(
    'procedencias',
    obtenerProcedenciasAction
  )
  const { data: subFamilias = [] } = useSWR<SelectOption[]>('subFamilias', obtenerSubFamiliasAction)
  const { data: unidadesMedida = [] } = useSWR<SelectOption[]>(
    'unidadesMedida',
    obtenerUnidadesMedidaAction
  )
  const { data: productos = [], isLoading: cargandoLista, mutate } = useSWR<ProductoRow[]>(
    'productos-inventario',
    listarProductosConLineaAction
  )

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ProductoFormData>({
    resolver: standardSchemaResolver(productoFormSchema),
    defaultValues
  })

  const watchCodigo = useWatch({
    control,
    name: 'codigo',
    defaultValue: ''
  })

  const productosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return productos
    return productos.filter(
      (p) => p.codigo.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q)
    )
  }, [busqueda, productos])

  async function handleSelectProducto(codigoProducto: string) {
    setCargandoProducto(true)
    try {
      const prod = await obtenerProductoPorCodigoAction(codigoProducto)
      if (prod) {
        reset({
          codigo: prod.codigo,
          linea: prod.linea,
          activo: prod.activo,
          cEquivalente: prod.cEquivalente || '',
          codBarra: prod.codBarra || '',
          abreviatura: prod.abreviatura || '',
          descripcion: prod.descripcion,
          afecto: prod.afecto,
          volumen: prod.volumen,
          peso: prod.peso,
          destVenta: prod.destVenta,
          destCompra: prod.destCompra,
          tipo: prod.tipo || '',
          procedencia: prod.procedencia || '',
          subFamilia: prod.subFamilia || '',
          undMedida: prod.undMedida || '',
          valorSoles: prod.valorSoles,
          valorDolares: prod.valorDolares
        })
        setIsEditing(true)
        setAuditInfo({
          usuario: prod.usuarioModificacion,
          fecha: prod.fechaModificacion ? formatDate(prod.fechaModificacion) : undefined,
          hora: prod.horaModificacion
        })
      } else {
        toast.error('No se encontraron los datos del producto seleccionado.')
      }
    } catch (err) {
      console.error('Error al cargar producto:', err)
      toast.error('Error al cargar los detalles del producto.')
    } finally {
      setCargandoProducto(false)
    }
  }

  function limpiarFormulario() {
    reset(defaultValues)
    setIsEditing(false)
    setAuditInfo(null)
  }

  async function handleFormSubmit(data: ProductoFormData) {
    setGuardando(true)
    const result = await guardarProductoAction(data)
    setGuardando(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(
      isEditing ? 'Producto actualizado correctamente' : 'Producto creado correctamente'
    )
    mutate()
    limpiarFormulario()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
            <PackageIcon className="size-5" weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Maestro de Productos</h1>
            <p className="text-sm text-muted-foreground">
              Registro y consulta de productos, unidades, precios y clasificación.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="shadow-sm xl:col-span-5">
          <CardHeader>
            <CardTitle className="text-base">Datos del Producto</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col">
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="linea">Línea</Label>
                  <Controller
                    name="linea"
                    control={control}
                    render={({ field }) => {
                      const handleLineaSelectChange = async (val: string | null) => {
                        field.onChange(val || '')
                        if (!val) {
                          setValue('codigo', '')
                          return
                        }
                        const selectedLine = lineas.find((l) => l.codigo === val)
                        if (selectedLine?.abreviatura) {
                          try {
                            const nextCode = await obtenerSiguienteCodigoProductoAction(
                              selectedLine.abreviatura
                            )
                            setValue('codigo', nextCode)
                          } catch (err) {
                            console.error('Error fetching next product code:', err)
                          }
                        }
                      }
                      return (
                        <Select value={field.value} onValueChange={handleLineaSelectChange}>
                          <SelectTrigger id="linea" className="w-full">
                            <SelectValue placeholder="Seleccionar...">
                              {(value: string | null) =>
                                lineas.find((l) => l.codigo === value)?.descripcion ??
                                'Seleccionar...'
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {lineas.map((linea) => (
                              <SelectItem key={linea.codigo} value={linea.codigo}>
                                {linea.descripcion}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )
                    }}
                  />
                  {errors.linea && (
                    <p className="text-xs text-destructive">{errors.linea.message}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 pb-1">
                  <Label className="flex items-center gap-2 text-xs font-normal">
                    <Controller
                      name="activo"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="activo"
                          checked={field.value}
                          onCheckedChange={(val) => field.onChange(val === true)}
                        />
                      )}
                    />
                    Activo
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    placeholder="Generado automáticamente..."
                    {...register('codigo')}
                    readOnly
                    className="bg-secondary/50 cursor-not-allowed "
                  />
                  {errors.codigo && (
                    <p className="text-xs text-destructive">{errors.codigo.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cEquivalente">C. Equivalente</Label>
                  <Input
                    id="cEquivalente"
                    placeholder="Código equivalente"
                    className=""
                    {...register('cEquivalente')}
                  />
                  {errors.cEquivalente && (
                    <p className="text-xs text-destructive">{errors.cEquivalente.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="codBarra">Cód. Barra</Label>
                  <Input
                    id="codBarra"
                    placeholder="Código de barras"
                    className=""
                    {...register('codBarra')}
                  />
                  {errors.codBarra && (
                    <p className="text-xs text-destructive">{errors.codBarra.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="abreviatura">Abreviatura</Label>
                  <Input
                    id="abreviatura"
                    placeholder="Abreviatura"
                    className=""
                    {...register('abreviatura')}
                  />
                  {errors.abreviatura && (
                    <p className="text-xs text-destructive">{errors.abreviatura.message}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  placeholder="Descripción del producto"
                  className=""
                  {...register('descripcion')}
                />
                {errors.descripcion && (
                  <p className="text-xs text-destructive">{errors.descripcion.message}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                <Label className="flex items-center gap-2 text-xs font-normal">
                  <Controller
                    name="afecto"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="afecto"
                        checked={field.value}
                        onCheckedChange={(val) => field.onChange(val === true)}
                      />
                    )}
                  />
                  Afecto
                </Label>
                <div className="flex items-center gap-2">
                  <Label htmlFor="volumen" className="text-xs whitespace-nowrap">
                    Volumen
                  </Label>
                  <Input
                    id="volumen"
                    type="number"
                    step="0.01"
                    className="h-8 w-24 text-right"
                    {...register('volumen', { valueAsNumber: true })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="peso" className="text-xs whitespace-nowrap">
                    Peso
                  </Label>
                  <Input
                    id="peso"
                    type="number"
                    step="0.01"
                    className="h-8 w-24 text-right"
                    {...register('peso', { valueAsNumber: true })}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                    Destinado a:
                  </span>
                  <Label className="flex items-center gap-1.5 text-xs font-normal">
                    <Controller
                      name="destVenta"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="dest-venta"
                          checked={field.value}
                          onCheckedChange={(val) => field.onChange(val === true)}
                        />
                      )}
                    />
                    Venta
                  </Label>
                  <Label className="flex items-center gap-1.5 text-xs font-normal">
                    <Controller
                      name="destCompra"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id="dest-compra"
                          checked={field.value}
                          onCheckedChange={(val) => field.onChange(val === true)}
                        />
                      )}
                    />
                    Compra
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Controller
                    name="tipo"
                    control={control}
                    render={({ field }) => {
                      const handleTipoSelectChange = (val: string | null) => {
                        field.onChange(val || '')
                      }
                      return (
                        <Select value={field.value} onValueChange={handleTipoSelectChange}>
                          <SelectTrigger id="tipo" className="w-full">
                            <SelectValue placeholder="Seleccionar...">
                              {(value: string | null) =>
                                tipos.find((t) => t.codigo === value)?.descripcion ??
                                'Seleccionar...'
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {tipos.map((item) => (
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
                  <Label htmlFor="procedencia">Procedencia</Label>
                  <Controller
                    name="procedencia"
                    control={control}
                    render={({ field }) => {
                      const handleProcedenciaSelectChange = (val: string | null) => {
                        field.onChange(val || '')
                      }
                      return (
                        <Select value={field.value} onValueChange={handleProcedenciaSelectChange}>
                          <SelectTrigger id="procedencia" className="w-full">
                            <SelectValue placeholder="Seleccionar...">
                              {(value: string | null) =>
                                procedencias.find((p) => p.codigo === value)?.descripcion ??
                                'Seleccionar...'
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {procedencias.map((item) => (
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
                  <Label htmlFor="subFamilia">Sub Familia</Label>
                  <Controller
                    name="subFamilia"
                    control={control}
                    render={({ field }) => {
                      const handleSubFamiliaSelectChange = (val: string | null) => {
                        field.onChange(val || '')
                      }
                      return (
                        <Select value={field.value} onValueChange={handleSubFamiliaSelectChange}>
                          <SelectTrigger id="subFamilia" className="w-full">
                            <SelectValue placeholder="Seleccionar...">
                              {(value: string | null) =>
                                subFamilias.find((s) => s.codigo === value)?.descripcion ??
                                'Seleccionar...'
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {subFamilias.map((item) => (
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
                  <Label htmlFor="undMedida">Und. Medida</Label>
                  <Controller
                    name="undMedida"
                    control={control}
                    render={({ field }) => {
                      const handleUndMedidaSelectChange = (val: string | null) => {
                        field.onChange(val || '')
                      }
                      return (
                        <Select value={field.value} onValueChange={handleUndMedidaSelectChange}>
                          <SelectTrigger id="undMedida" className="w-full">
                            <SelectValue placeholder="Seleccionar...">
                              {(value: string | null) =>
                                unidadesMedida.find((u) => u.codigo === value)?.descripcion ??
                                'Seleccionar...'
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {unidadesMedida.map((item) => (
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
                  <Label htmlFor="valorSoles">Valor Venta — Soles</Label>
                  <Input
                    id="valorSoles"
                    type="number"
                    step="0.0001"
                    className="text-right"
                    {...register('valorSoles', { valueAsNumber: true })}
                  />
                  {errors.valorSoles && (
                    <p className="text-xs text-destructive">{errors.valorSoles.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="valorDolares">Valor Venta — Dólares</Label>
                  <Input
                    id="valorDolares"
                    type="number"
                    step="0.0001"
                    className="text-right"
                    {...register('valorDolares', { valueAsNumber: true })}
                  />
                  {errors.valorDolares && (
                    <p className="text-xs text-destructive">{errors.valorDolares.message}</p>
                  )}
                </div>
              </div>

              {auditInfo && (
                <div className="flex flex-col items-stretch gap-3 rounded-md border bg-secondary/40 p-3 text-xs sm:flex-row sm:items-center">
                  <span className="rounded-sm bg-primary/12 px-2 py-0.5 font-semibold text-primary ">
                    {auditInfo.usuario || 'SUPERVISOR'}
                  </span>
                  <span className="text-muted-foreground">Última modificación:</span>
                  <span className="font-mono text-foreground">
                    {auditInfo.fecha || ''} {auditInfo.hora || ''}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={limpiarFormulario}
                  disabled={guardando || cargandoProducto}
                >
                  <XCircleIcon className="mr-2 size-4" />
                  Cancelar
                </Button>
                <Button type="submit" disabled={guardando || cargandoProducto}>
                  <FloppyDiskIcon className="mr-2 size-4" />
                  {guardando ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
        <Card className="shadow-sm xl:col-span-7">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Listado de Productos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por código o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9"
                aria-label="Buscar producto"
              />
            </div>

            <div className="rounded-md border">
              <div className="max-h-140 overflow-auto">
                <Table className="text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-table-header">
                    <TableRow>
                      <TableHead className="h-9 w-[20%]">Código</TableHead>
                      <TableHead className="h-9 w-[50%]">Descripción</TableHead>
                      <TableHead className="h-9 w-[30%]">Línea</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cargandoLista ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          Cargando productos...
                        </TableCell>
                      </TableRow>
                    ) : productosFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          Sin resultados
                        </TableCell>
                      </TableRow>
                    ) : (
                      productosFiltrados.map((producto) => (
                        <TableRow
                          key={producto.codigo}
                          className={`hover:bg-table-row-hover cursor-pointer ${
                            watchCodigo === producto.codigo ? 'bg-primary/5 font-medium' : ''
                          }`}
                          onClick={() => handleSelectProducto(producto.codigo)}
                        >
                          <TableCell className="font-mono text-xs truncate">
                            {producto.codigo}
                          </TableCell>
                          <TableCell className="truncate" title={producto.descripcion}>
                            {producto.descripcion}
                          </TableCell>
                          <TableCell className="truncate" title={producto.linea}>
                            {producto.linea || '-'}
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
