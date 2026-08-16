'use client'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useState, useTransition } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import {
  eliminarDocumentosAction,
  listarTiposDocumentoAction,
  type TipoDocumentoDto
} from '@/actions/configuracion.actions'
import {
  eliminacionDocumentosSchema,
  type EliminacionDocumentosInput
} from '@/validators/eliminacion-documentos.schema'

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
import { FileIcon, TrashIcon } from '@phosphor-icons/react'

const DOCUMENTOS = [
  { value: 'documento', label: 'Documento' },
  { value: 'guia', label: 'Guía' }
]

export default function EliminacionDocumentosPage() {
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumentoDto[]>([])
  const [isPending, startTransition] = useTransition()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EliminacionDocumentosInput>({
    resolver: standardSchemaResolver(eliminacionDocumentosSchema),
    defaultValues: {
      documento: '',
      tipo: '',
      numero: ''
    }
  })

  const documento = useWatch({ control, name: 'documento', defaultValue: '' })

  const handleDocumentoChange = (value: string | null) => {
    const newValue = value ?? ''

    if (newValue === 'documento' || newValue === 'guia') {
      startTransition(async () => {
        const tipos = await listarTiposDocumentoAction(newValue)
        setTiposDocumento(tipos)
      })
    } else {
      setTiposDocumento([])
    }
  }

  const onSubmit = async (data: EliminacionDocumentosInput) => {
    const result = await eliminarDocumentosAction({
      cdgTdoc: data.tipo,
      numDocu: data.numero
    })

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(
      `Documento eliminado: ${result.eliminadosM ?? 0} maestro(s), ${result.eliminadosD ?? 0} detalle(s), ${result.eliminadosC ?? 0} cuenta corriente`
    )
  }

  const handleProcesar = () => {
    handleSubmit(onSubmit)()
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Eliminación de Documentos</h1>
          <p className="text-muted-foreground">
            Eliminar documentos obsoletos o temporales del sistema.
          </p>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrashIcon className="size-5 text-primary" weight="duotone" />
              Parámetros de Eliminación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* Eliminar */}
              <div className="flex items-center gap-4">
                <Label className="w-24 text-right text-sm font-medium">Eliminar</Label>
                <Controller
                  name="documento"
                  control={control}
                  render={({ field }) => {
                    const handleDocumentoSelectChange = (val: string | null) => {
                      field.onChange(val || '')
                      handleDocumentoChange(val || '')
                    }
                    return (
                      <Select value={field.value} onValueChange={handleDocumentoSelectChange}>
                        <SelectTrigger className="w-72">
                          <SelectValue placeholder="Seleccionar documento...">
                            {(value: string | null) =>
                              DOCUMENTOS.find((d) => d.value === value)?.label ??
                              'Seleccionar documento...'
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {DOCUMENTOS.map((d) => (
                            <SelectItem key={d.value} value={d.value}>
                              {d.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  }}
                />
              </div>
              {errors.documento && (
                <p className="text-xs text-destructive ml-28">{errors.documento.message}</p>
              )}

              {/* Tipo */}
              <div className="flex items-center gap-4">
                <Label className="w-24 text-right text-sm font-medium">Tipo</Label>
                <Controller
                  name="tipo"
                  control={control}
                  render={({ field }) => {
                    const handleTipoSelectChange = (val: string | null) => {
                      field.onChange(val || '')
                    }
                    return (
                      <Select
                        value={field.value}
                        onValueChange={handleTipoSelectChange}
                        disabled={!documento || isPending}
                      >
                        <SelectTrigger className="w-72">
                          <SelectValue placeholder="Seleccionar tipo...">
                            {(value: string | null) =>
                              tiposDocumento.find((t) => t.numItem === value)?.desItem ??
                              'Seleccionar tipo...'
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {tiposDocumento.map((t) => (
                            <SelectItem key={t.numItem} value={t.numItem}>
                              {t.desItem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  }}
                />
              </div>
              {errors.tipo && (
                <p className="text-xs text-destructive ml-28">{errors.tipo.message}</p>
              )}

              {/* Número */}
              <div className="flex items-center gap-4">
                <Label className="w-24 text-right text-sm font-medium" htmlFor="numero-doc">
                  Número
                </Label>
                <Input
                  id="numero-doc"
                  className="w-72"
                  placeholder="N° de documento"
                  {...register('numero')}
                />
              </div>
              {errors.numero && (
                <p className="text-xs text-destructive ml-28">{errors.numero.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleProcesar} disabled={!documento}>
            <FileIcon className="size-4" weight="bold" />
            Procesar
          </Button>
        </div>
      </div>
    </div>
  )
}
