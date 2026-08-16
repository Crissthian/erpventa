'use client'

import { useState } from 'react'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { guardarOpcionesSistemaAction } from '@/actions/configuracion.actions'
import { OpcionesSistema } from '@/configuracion/domain/entities/opciones-sistema.entity'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  opcionesSistemaSchema,
  type OpcionesSistemaInput
} from '@/validators/opciones-sistema.schema'
import { CheckCircleIcon, GearSixIcon } from '@phosphor-icons/react'

interface OpcionesSistemaClientPageProps {
  opcionesIniciales: OpcionesSistema | null
}

const valoresPorDefecto: OpcionesSistemaInput = {
  manejoStock: 'sin_stock',
  puntoVentaCtaCte: 'pendiente',
  puntoVentaFacturacion: 'multiple',
  correlativoPedido: 'automatico',
  correlativoOrdenCompra: 'automatico',
  porcRetencion: '0.00',
  importeMaxRetencion: '0.00',
  fechaInicio: '',
  agentePercepcion: 'afecto',
  nombreRuc: 'R.U.C.',
  nombreIgv: 'I.G.V',
  porcIgv: '18.00',
  deudaVencida: '0.00',
  correlativoCobranza: 'automatico',
  maxExcesoOrden: '50.0000',
  modificacionPrecios: 'permite',
  costeoProduccion: 'ultimo_costo'
}

type RadioValue = OpcionesSistemaInput[keyof OpcionesSistemaInput]

const NUM_TO_RADIO = (value: number, map: Record<number, RadioValue>): RadioValue => {
  return (map[value] ?? valoresPorDefecto.manejoStock) as RadioValue
}

const MAPAS_NUM_RADIO = {
  manejoStock: { 1: 'con_stock', 2: 'sin_stock' } as Record<number, RadioValue>,
  puntoVentaCtaCte: { 1: 'cancelada', 2: 'pendiente' } as Record<number, RadioValue>,
  puntoVentaFacturacion: { 1: 'varios', 2: 'multiple' } as Record<number, RadioValue>,
  correlativoPedido: { 1: 'automatico', 2: 'serie' } as Record<number, RadioValue>,
  correlativoOrdenCompra: { 1: 'automatico', 2: 'numerico' } as Record<number, RadioValue>,
  agentePercepcion: { 1: 'no_afecto', 2: 'afecto' } as Record<number, RadioValue>,
  correlativoCobranza: { 1: 'automatico', 2: 'serie' } as Record<number, RadioValue>,
  modificacionPrecios: { 1: 'permite', 2: 'no_permite' } as Record<number, RadioValue>,
  costeoProduccion: { 1: 'ultimo_costo', 2: 'promedio' } as Record<number, RadioValue>
}

function mapearOpcionesIniciales(op: OpcionesSistema | null): OpcionesSistemaInput {
  if (!op) return { ...valoresPorDefecto }

  return {
    manejoStock: NUM_TO_RADIO(op.mstock, MAPAS_NUM_RADIO.manejoStock),
    puntoVentaCtaCte: NUM_TO_RADIO(op.mcancel, MAPAS_NUM_RADIO.puntoVentaCtaCte),
    puntoVentaFacturacion: NUM_TO_RADIO(op.n1, MAPAS_NUM_RADIO.puntoVentaFacturacion),
    correlativoPedido: NUM_TO_RADIO(op.n2, MAPAS_NUM_RADIO.correlativoPedido),
    correlativoOrdenCompra: NUM_TO_RADIO(op.nref3, MAPAS_NUM_RADIO.correlativoOrdenCompra),
    porcRetencion: op.n5 || '0.00',
    importeMaxRetencion: op.n6 || '0.00',
    fechaInicio: op.n4 || '',
    agentePercepcion: NUM_TO_RADIO(parseInt(op.cref3) || 1, MAPAS_NUM_RADIO.agentePercepcion),
    nombreRuc: op.nruc || 'R.U.C.',
    nombreIgv: op.nigv || 'I.G.V',
    porcIgv: op.nporigv?.toString() || '18.00',
    deudaVencida: op.nref4?.toString() || '0.00',
    correlativoCobranza: NUM_TO_RADIO(op.nref1, MAPAS_NUM_RADIO.correlativoCobranza),
    maxExcesoOrden: op.cref1 || '50.0000',
    modificacionPrecios: NUM_TO_RADIO(parseInt(op.cref2) || 1, MAPAS_NUM_RADIO.modificacionPrecios),
    costeoProduccion: NUM_TO_RADIO(op.nref2, MAPAS_NUM_RADIO.costeoProduccion)
  } as OpcionesSistemaInput
}

export function OpcionesSistemaClientPage({ opcionesIniciales }: OpcionesSistemaClientPageProps) {
  const [guardando, setGuardando] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<OpcionesSistemaInput>({
    resolver: standardSchemaResolver(opcionesSistemaSchema),
    defaultValues: mapearOpcionesIniciales(opcionesIniciales)
  })

  const onSubmit = async (data: OpcionesSistemaInput) => {
    setGuardando(true)
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value))
    })

    const result = await guardarOpcionesSistemaAction(null, formData)
    setGuardando(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Opciones del sistema guardadas correctamente')
    reset(data)
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-6xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <GearSixIcon className="size-5 text-primary" weight="duotone" />
                  Parámetros de Configuración
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Columna 1: Stock y Ventas */}
                <div className="flex flex-col gap-5">
                  <Seccion titulo="Manejo de Stock">
                    <Controller
                      name="manejoStock"
                      control={control}
                      render={({ field }) => {
                        const handleManejoStockChange = (v: string) => field.onChange(v)
                        return (
                          <RadioGroup value={field.value} onValueChange={handleManejoStockChange}>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="stock-con" value="con_stock" />
                              <Label htmlFor="stock-con" className="text-sm cursor-pointer">
                                Permite Vender con Stock
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="stock-sin" value="sin_stock" />
                              <Label htmlFor="stock-sin" className="text-sm cursor-pointer">
                                Permite Vender sin Stock
                              </Label>
                            </div>
                          </RadioGroup>
                        )
                      }}
                    />
                  </Seccion>

                  <Seccion titulo="Punto de Venta">
                    <Controller
                      name="puntoVentaCtaCte"
                      control={control}
                      render={({ field }) => {
                        const handleCtaCteChange = (v: string) => field.onChange(v)
                        return (
                          <RadioGroup value={field.value} onValueChange={handleCtaCteChange}>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="cta-cancelada" value="cancelada" />
                              <Label htmlFor="cta-cancelada" className="text-sm cursor-pointer">
                                Cargar Cta Cte Cancelada
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="cta-pendiente" value="pendiente" />
                              <Label htmlFor="cta-pendiente" className="text-sm cursor-pointer">
                                Carga Cta Cte Pendiente
                              </Label>
                            </div>
                          </RadioGroup>
                        )
                      }}
                    />
                  </Seccion>

                  <Seccion titulo="Punto de Venta">
                    <Controller
                      name="puntoVentaFacturacion"
                      control={control}
                      render={({ field }) => {
                        const handleFacturacionChange = (v: string) => field.onChange(v)
                        return (
                          <RadioGroup value={field.value} onValueChange={handleFacturacionChange}>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="fact-varios" value="varios" />
                              <Label htmlFor="fact-varios" className="text-sm cursor-pointer">
                                Facturación Varios Puntos
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="fact-multiple" value="multiple" />
                              <Label htmlFor="fact-multiple" className="text-sm cursor-pointer">
                                Facturación Múltiple
                              </Label>
                            </div>
                          </RadioGroup>
                        )
                      }}
                    />
                  </Seccion>

                  <Seccion titulo="Correlativo de Pedido">
                    <Controller
                      name="correlativoPedido"
                      control={control}
                      render={({ field }) => {
                        const handlePedidoChange = (v: string) => field.onChange(v)
                        return (
                          <RadioGroup value={field.value} onValueChange={handlePedidoChange}>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="ped-auto" value="automatico" />
                              <Label htmlFor="ped-auto" className="text-sm cursor-pointer">
                                Correlativo Automático
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="ped-serie" value="serie" />
                              <Label htmlFor="ped-serie" className="text-sm cursor-pointer">
                                Correlativo con N° Serie
                              </Label>
                            </div>
                          </RadioGroup>
                        )
                      }}
                    />
                  </Seccion>

                  <Seccion titulo="Correlativo de Orden de Compra">
                    <Controller
                      name="correlativoOrdenCompra"
                      control={control}
                      render={({ field }) => {
                        const handleOrdenCompraChange = (v: string) => field.onChange(v)
                        return (
                          <RadioGroup value={field.value} onValueChange={handleOrdenCompraChange}>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="oc-auto" value="automatico" />
                              <Label htmlFor="oc-auto" className="text-sm cursor-pointer">
                                Correlativo Automático
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="oc-num" value="numerico" />
                              <Label htmlFor="oc-num" className="text-sm cursor-pointer">
                                Poner N°. Correlativo
                              </Label>
                            </div>
                          </RadioGroup>
                        )
                      }}
                    />
                  </Seccion>
                </div>

                {/* Columna 2: Retención y Percepción */}
                <div className="flex flex-col gap-5">
                  <Seccion titulo="Agente de Retención">
                    <Controller
                      name="agentePercepcion"
                      control={control}
                      render={({ field }) => {
                        const handlePercepcionChange = (v: string) => field.onChange(v)
                        return (
                          <RadioGroup value={field.value} onValueChange={handlePercepcionChange}>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="perc-no" value="no_afecto" />
                              <Label htmlFor="perc-no" className="text-sm cursor-pointer">
                                No Afecto
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="perc-si" value="afecto" />
                              <Label htmlFor="perc-si" className="text-sm cursor-pointer">
                                Afecto
                              </Label>
                            </div>
                          </RadioGroup>
                        )
                      }}
                    />
                    <div className="mt-3 flex flex-col gap-3">
                      <CampoInput
                        label="Porc. de Retención"
                        id="porc-ret"
                        {...register('porcRetencion')}
                        error={errors.porcRetencion?.message}
                      />
                      <CampoInput
                        label="Importe Max. Retención"
                        id="imp-ret"
                        {...register('importeMaxRetencion')}
                        error={errors.importeMaxRetencion?.message}
                      />
                      <CampoInput
                        label="Fecha de Inicio"
                        id="fecha-ini"
                        type="date"
                        {...register('fechaInicio')}
                        error={errors.fechaInicio?.message}
                      />
                    </div>
                  </Seccion>

                  <Seccion titulo="Impuestos">
                    <div className="flex flex-col gap-3">
                      <CampoInput
                        label="Nombre del RUC"
                        id="nombre-ruc"
                        {...register('nombreRuc')}
                        error={errors.nombreRuc?.message}
                      />
                      <CampoInput
                        label="Nombre IGV"
                        id="nombre-igv"
                        {...register('nombreIgv')}
                        error={errors.nombreIgv?.message}
                      />
                      <CampoInput
                        label="Porc. de IGV"
                        id="porc-igv"
                        {...register('porcIgv')}
                        error={errors.porcIgv?.message}
                      />
                    </div>
                  </Seccion>
                </div>

                {/* Columna 3: Cobranza, Precios y Costeo */}
                <div className="flex flex-col gap-5">
                  <Seccion titulo="% Deuda Vencida">
                    <CampoInput
                      label=""
                      id="deuda-vencida"
                      placeholder="0.00"
                      {...register('deudaVencida')}
                      error={errors.deudaVencida?.message}
                    />
                  </Seccion>

                  <Seccion titulo="Correlativo de Informe de Cobranza">
                    <Controller
                      name="correlativoCobranza"
                      control={control}
                      render={({ field }) => {
                        const handleCobranzaChange = (v: string) => field.onChange(v)
                        return (
                          <RadioGroup value={field.value} onValueChange={handleCobranzaChange}>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="cob-auto" value="automatico" />
                              <Label htmlFor="cob-auto" className="text-sm cursor-pointer">
                                Correlativo Automático
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="cob-serie" value="serie" />
                              <Label htmlFor="cob-serie" className="text-sm cursor-pointer">
                                Correlativo con Serie
                              </Label>
                            </div>
                          </RadioGroup>
                        )
                      }}
                    />
                  </Seccion>

                  <Seccion titulo="% Max de Exceso Orden Compra / N.Ingreso">
                    <CampoInput
                      label=""
                      id="max-exceso"
                      placeholder="50.0000"
                      {...register('maxExcesoOrden')}
                      error={errors.maxExcesoOrden?.message}
                    />
                  </Seccion>

                  <Seccion titulo="Modificación de Precios">
                    <Controller
                      name="modificacionPrecios"
                      control={control}
                      render={({ field }) => {
                        const handlePreciosChange = (v: string) => field.onChange(v)
                        return (
                          <RadioGroup value={field.value} onValueChange={handlePreciosChange}>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="prec-permite" value="permite" />
                              <Label htmlFor="prec-permite" className="text-sm cursor-pointer">
                                Permite modificar los precios y dsctos
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="prec-no" value="no_permite" />
                              <Label htmlFor="prec-no" className="text-sm cursor-pointer">
                                No Permite modificar precios y dsctos
                              </Label>
                            </div>
                          </RadioGroup>
                        )
                      }}
                    />
                  </Seccion>

                  <Seccion titulo="Costeo de Producción">
                    <Controller
                      name="costeoProduccion"
                      control={control}
                      render={({ field }) => {
                        const handleCosteoChange = (v: string) => field.onChange(v)
                        return (
                          <RadioGroup value={field.value} onValueChange={handleCosteoChange}>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="cost-ultimo" value="ultimo_costo" />
                              <Label htmlFor="cost-ultimo" className="text-sm cursor-pointer">
                                Último Costo
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem id="cost-promedio" value="promedio" />
                              <Label htmlFor="cost-promedio" className="text-sm cursor-pointer">
                                Costo Promedio
                              </Label>
                            </div>
                          </RadioGroup>
                        )
                      }}
                    />
                  </Seccion>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => reset(mapearOpcionesIniciales(opcionesIniciales))}
                  disabled={guardando}
                >
                  Cancelar
                </Button>
                <Button type="submit" size="sm" disabled={guardando}>
                  <CheckCircleIcon className="size-4" weight="bold" />
                  {guardando ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-md border border-border p-3 space-y-2">
      <legend className="px-1 text-xs font-semibold text-muted-foreground">{titulo}</legend>
      {children}
    </fieldset>
  )
}

function CampoInput({
  label,
  id,
  error,
  ...inputProps
}: {
  label: string
  id: string
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label htmlFor={id} className="text-xs">
          {label}
        </Label>
      )}
      <Input id={id} type={inputProps.type ?? 'text'} {...inputProps} className="h-8 text-sm" />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
