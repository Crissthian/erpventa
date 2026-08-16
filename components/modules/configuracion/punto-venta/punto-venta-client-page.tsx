'use client'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useEffect, useMemo, useState, useTransition, type ChangeEvent } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  buscarCorrelativoAction,
  guardarCorrelativoAction,
  type TipoDocumentoItem
} from '@/actions/punto-venta.actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
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
import type { CorrelacionTipo } from '@/configuracion/domain/entities/punto-venta-correlativo.entity'
import { cn } from '@/lib/utils'
import { FilePlusIcon, FloppyDiskIcon } from '@phosphor-icons/react'

const CORRELACIONES_CON_TABLA: CorrelacionTipo[] = ['documento', 'guia']
// VALIDACIONES DE TAMANO DE SERIE Y NUMERO
const SERIE_MAX_DOC = 4
const SERIE_MAX_GUIA = 3
const NUMERO_TOTAL_LENGTH_DOC = 11
const NUMERO_TOTAL_LENGTH_GUIA = 10

type Modo = 'inicial' | 'encontrado' | 'crear' | 'rechazado'

const puntoVentaSchema = z
  .object({
    correlacion: z.string().min(1, 'Seleccione una correlación'),
    tipoDocumento: z.string().min(1, 'Seleccione un tipo de documento'),
    serieDocumento: z
      .string()
      .min(1, 'La serie es obligatoria')
      .max(
        Math.max(SERIE_MAX_DOC, SERIE_MAX_GUIA),
        `La serie no puede exceder ${Math.max(SERIE_MAX_DOC, SERIE_MAX_GUIA)} caracteres`
      ),
    numeroDocumento: z
      .string()
      .min(1, 'El número es obligatorio')
      .max(
        Math.max(NUMERO_TOTAL_LENGTH_DOC, NUMERO_TOTAL_LENGTH_GUIA),
        `El número no puede exceder ${Math.max(NUMERO_TOTAL_LENGTH_DOC, NUMERO_TOTAL_LENGTH_GUIA)} caracteres`
      )
  })
  .refine(
    (data) => {
      const total = data.correlacion === 'guia' ? NUMERO_TOTAL_LENGTH_GUIA : NUMERO_TOTAL_LENGTH_DOC
      return data.serieDocumento.length + data.numeroDocumento.length <= total
    },
    {
      message: 'Serie + número excede el límite de la correlación',
      path: ['numeroDocumento']
    }
  )

type PuntoVentaFormData = z.infer<typeof puntoVentaSchema>

interface PuntoVentaClientPageProps {
  tiposDocumentoInitiales: {
    documento: TipoDocumentoItem[]
    guia: TipoDocumentoItem[]
  }
}

const RETENCION_ITEMS: TipoDocumentoItem[] = [{ value: 'retencion', label: 'Retención' }]

export function PuntoVentaClientPage({ tiposDocumentoInitiales }: PuntoVentaClientPageProps) {
  const tiposDocMap = useMemo<Record<string, TipoDocumentoItem[]>>(
    () => ({
      documento: tiposDocumentoInitiales.documento,
      guia: tiposDocumentoInitiales.guia,
      retencion: RETENCION_ITEMS
    }),
    [tiposDocumentoInitiales]
  )

  const defaultValues = useMemo<PuntoVentaFormData>(
    () => ({
      correlacion: 'documento',
      tipoDocumento: tiposDocumentoInitiales.documento[0]?.value ?? '',
      serieDocumento: '',
      numeroDocumento: ''
    }),
    [tiposDocumentoInitiales]
  )

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<PuntoVentaFormData>({
    resolver: standardSchemaResolver(puntoVentaSchema),
    defaultValues
  })

  const correlacion = useWatch({ control, name: 'correlacion' })
  const serieDocumentoWatch = useWatch({ control, name: 'serieDocumento' })
  const serie = (serieDocumentoWatch ?? '').trim()

  const tiposDocumento = useMemo(() => {
    return tiposDocMap[correlacion] ?? tiposDocMap.documento
  }, [correlacion, tiposDocMap])

  // Corregido: Sincronización del tipo de documento seleccionado con useEffect en vez de useEffectLike
  useEffect(() => {
    const tipoValido = tiposDocumento.some((t) => t.value === getValues('tipoDocumento'))
    if (!tipoValido && tiposDocumento.length > 0) {
      setValue('tipoDocumento', tiposDocumento[0].value)
    }
  }, [tiposDocumento, setValue, getValues])

  const [modo, setModo] = useState<Modo>('inicial')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const validado = modo === 'encontrado' || modo === 'crear'
  const guardarHabilitado = validado && !isPending
  const serieMaxInput = correlacion === 'guia' ? SERIE_MAX_GUIA : SERIE_MAX_DOC
  const numeroTotalLength = correlacion === 'guia' ? NUMERO_TOTAL_LENGTH_GUIA : NUMERO_TOTAL_LENGTH_DOC
  const maxNumeroLength = Math.max(0, numeroTotalLength - serie.length)

  const serieField = register('serieDocumento')
  const numeroField = register('numeroDocumento')

  function resetValidacion() {
    setModo('inicial')
    setValue('numeroDocumento', '')
  }

  function handleGuardar(data: PuntoVentaFormData) {
    if (!validado) {
      toast.error('Debe validar la serie antes de guardar')
      return
    }
    if (!CORRELACIONES_CON_TABLA.includes(data.correlacion as CorrelacionTipo)) return

    const payload = {
      correlacion: data.correlacion as CorrelacionTipo,
      tipo: data.tipoDocumento,
      serie: data.serieDocumento,
      numero: data.serieDocumento + data.numeroDocumento,
      modo: modo === 'encontrado' ? ('actualizar' as const) : ('crear' as const)
    }

    startTransition(async () => {
      const result = await guardarCorrelativoAction(payload)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(
        payload.modo === 'crear'
          ? 'Correlativo creado correctamente'
          : 'Correlativo actualizado correctamente'
      )
      setModo('encontrado')
    })
  }

  function handleNuevoClick() {
    reset(defaultValues)
    setModo('inicial')
    setDialogOpen(false)
    toast.info('Formulario reiniciado')
  }

  function handleCorrelacionChange(onChange: (value: string) => void) {
    return (value: string | null) => {
      if (!value) return
      onChange(value)
      setValue('serieDocumento', '')
      setValue('numeroDocumento', '')
      resetValidacion()
      const nuevosTipos = tiposDocMap[value] ?? tiposDocMap.documento
      setValue('tipoDocumento', nuevosTipos[0].value)
    }
  }

  function handleTipoDocumentoChange(onChange: (value: string) => void) {
    return (value: string | null) => {
      if (!value) return
      onChange(value)
      resetValidacion()
    }
  }

  async function handleSerieBlur() {
    const values = getValues()
    const tipo = values.tipoDocumento.trim()
    const serieActual = values.serieDocumento.trim()
    const corr = values.correlacion as CorrelacionTipo

    if (!serieActual || !tipo) return
    if (!CORRELACIONES_CON_TABLA.includes(corr)) return

    resetValidacion()

    startTransition(async () => {
      try {
        const result = await buscarCorrelativoAction({
          correlacion: corr,
          tipoDocumento: tipo,
          serieDocumento: serieActual
        })
        if (result) {
          setModo('encontrado')
          const coincide = result.numero.toLowerCase().startsWith(serieActual.toLowerCase())
          const sufijo = coincide ? result.numero.slice(serieActual.length) : result.numero
          setValue('numeroDocumento', sufijo)
          return
        }
        setDialogOpen(true)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error al consultar el correlativo')
      }
    })
  }

  function handleDialogAccept() {
    setDialogOpen(false)
    setModo('crear')
    setValue('numeroDocumento', '')
    queueMicrotask(() => {
      document.getElementById('numeroDocumento')?.focus()
    })
  }

  function handleDialogCancel() {
    setDialogOpen(false)
    setModo('rechazado')
    setValue('numeroDocumento', '')
  }

  function handleSerieChange(e: ChangeEvent<HTMLInputElement>) {
    e.target.value = e.target.value.toUpperCase()
    serieField.onChange(e)
    if (validado) resetValidacion()
  }

  function handleSerieKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Tab' && e.key !== 'Enter') return
    e.preventDefault()
    handleSerieBlur()
  }

  return (
    <div className="flex justify-center">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Punto de Venta</h1>
          <p className="text-muted-foreground">Configuración de numeración y puntos de venta.</p>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Numeración Punto de Venta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleGuardar)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl">
                <div className="space-y-2">
                  <Label htmlFor="correlacion">Correlación</Label>
                  <Controller
                    name="correlacion"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={handleCorrelacionChange(field.onChange)}
                      >
                        <SelectTrigger id="correlacion" className="w-full">
                          <SelectValue placeholder="Seleccione correlación">
                            {(value: string | null) => {
                              const labels: Record<string, string> = {
                                documento: 'Documento',
                                guia: 'Guía',
                                retencion: 'Retención'
                              }
                              return value ? (labels[value] ?? value) : ''
                            }}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="documento">Documento</SelectItem>
                          <SelectItem value="guia">Guía</SelectItem>
                          <SelectItem value="retencion">Retención</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
                  <Controller
                    name="tipoDocumento"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={handleTipoDocumentoChange(field.onChange)}
                      >
                        <SelectTrigger id="tipoDocumento" className="w-full">
                          <SelectValue placeholder="Seleccione un tipo de documento">
                            {(value: string | null) =>
                              tiposDocumento.find((t) => t.value === value)?.label ?? ''
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {tiposDocumento.map((tipo) => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serieDocumento">Serie de Documento</Label>
                  <Input
                    id="serieDocumento"
                    placeholder="F001"
                    aria-invalid={!!errors.serieDocumento}
                    className={cn('uppercase', errors.serieDocumento && 'border-destructive')}
                    maxLength={serieMaxInput}
                    {...serieField}
                    onChange={handleSerieChange}
                    onKeyDown={handleSerieKeyDown}
                  />
                  {errors.serieDocumento && (
                    <p className="text-xs text-destructive">{errors.serieDocumento.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numeroDocumento">Número de Documento</Label>
                  <div
                    className={cn(
                      'flex overflow-hidden rounded-md border border-input transition-colors',
                      validado
                        ? 'focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50 outline-2 outline-offset-2 outline-ring'
                        : 'opacity-60',
                      errors.numeroDocumento && 'border-destructive'
                    )}
                  >
                    <Input
                      value={serie}
                      readOnly
                      tabIndex={-1}
                      aria-label="Prefijo de serie"
                      placeholder="—"
                      className="w-16 rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-end uppercase text-muted-foreground bg-muted/10"
                    />
                    <Input
                      id="numeroDocumento"
                      placeholder="0000000"
                      disabled={!validado}
                      aria-invalid={!!errors.numeroDocumento}
                      maxLength={maxNumeroLength}
                      className="rounded-none border-0 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 uppercase"
                      {...numeroField}
                      onChange={(e) => {
                        e.target.value = e.target.value.toUpperCase()
                        numeroField.onChange(e)
                      }}
                    />
                  </div>
                  {errors.numeroDocumento && (
                    <p className="text-xs text-destructive">{errors.numeroDocumento.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <Button type="button" variant="outline" onClick={handleNuevoClick}>
                  <FilePlusIcon className="mr-2 size-4" />
                  Nuevo
                </Button>
                <Button type="submit" disabled={!guardarHabilitado}>
                  <FloppyDiskIcon className="mr-2 size-4" />
                  {modo === 'encontrado' ? 'Actualizar' : 'Guardar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Serie no encontrada</AlertDialogTitle>
            <AlertDialogDescription>
              La serie ingresada no existe. ¿Desea crear un nuevo correlativo para esta serie?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDialogCancel}>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleDialogAccept}>Sí</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
