'use client'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { startTransition, useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import {
  eliminarOpcionUsuarioAction,
  guardarOpcionUsuarioAction,
  listarOpcionesUsuarioAction,
  type ModuloItemDto,
  type OpcionAsignadaDto,
  type OpcionCatalogoDto,
  type UsuarioSimpleDto
} from '@/actions/configuracion.actions'

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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
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
  asignacionOpcionesSchema,
  type AsignacionOpcionesInput
} from '@/validators/asignacion-opciones.schema'
import { PlusIcon, TrashIcon, UserIcon, UsersIcon } from '@phosphor-icons/react'

interface AsignarOpcionesClientPageProps {
  usuarios: UsuarioSimpleDto[]
  usuarioInicial: string
  opcionesIniciales: OpcionAsignadaDto[]
  modulos: ModuloItemDto[]
  opcionesCatalogo: OpcionCatalogoDto[]
}

const defaultValues: AsignacionOpcionesInput = {
  codigoModulo: '',
  numeroItem: '',
  estado: '1'
}

export function AsignarOpcionesClientPage({
  usuarios,
  usuarioInicial,
  opcionesIniciales,
  modulos,
  opcionesCatalogo
}: AsignarOpcionesClientPageProps) {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string>(usuarioInicial)
  const [opciones, setOpciones] = useState<OpcionAsignadaDto[]>(opcionesIniciales)
  const [cargando, setCargando] = useState(false)

  const [modalAbierto, setModalAbierto] = useState(false)
  const [opcionAEliminar, setOpcionAEliminar] = useState<OpcionAsignadaDto | null>(null)

  const { control, handleSubmit, reset } = useForm<AsignacionOpcionesInput>({
    resolver: standardSchemaResolver(asignacionOpcionesSchema),
    defaultValues
  })

  const codigoModulo = useWatch({
    control,
    name: 'codigoModulo',
    defaultValue: defaultValues.codigoModulo
  })

  const opcionesDelModulo = useMemo(
    () => opcionesCatalogo.filter((o) => o.codigoModulo === codigoModulo),
    [codigoModulo, opcionesCatalogo]
  )

  const abrirModal = () => {
    reset(defaultValues)
    setModalAbierto(true)
  }

  const handleAsignar = async (data: AsignacionOpcionesInput) => {
    if (!usuarioSeleccionado) {
      toast.warning('Seleccione un usuario antes de asignar')
      return
    }

    const result = await guardarOpcionUsuarioAction({
      codigoUsuario: usuarioSeleccionado,
      codigoOpcion: data.codigoModulo,
      numeroItem: data.numeroItem,
      estado: data.estado
    })

    if (result.error) {
      toast.error(result.error)
      return
    }

    const moduloLabel = modulos.find((m) => m.codigo === data.codigoModulo)?.descripcion
    const opcionLabel = opcionesDelModulo.find((o) => o.numeroItem === data.numeroItem)
      ?.descripcion
    toast.success(
      `Opción asignada: ${moduloLabel ?? ''} / ${opcionLabel ?? ''} / ${
        data.estado === '1' ? 'Activo' : 'Inactivo'
      }`
    )

    setModalAbierto(false)
    reset(defaultValues)

    setCargando(true)
    startTransition(async () => {
      const resultado = await listarOpcionesUsuarioAction(usuarioSeleccionado)
      setOpciones(resultado)
      setCargando(false)
    })
  }

  const handleEliminar = async () => {
    if (!opcionAEliminar || !usuarioSeleccionado) return

    const result = await eliminarOpcionUsuarioAction({
      codigoUsuario: usuarioSeleccionado,
      codigoOpcion: opcionAEliminar.codigoModulo,
      numeroItem: opcionAEliminar.numeroItem
    })

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(`Opción eliminada: ${opcionAEliminar.modulo} / ${opcionAEliminar.opcion}`)
    setOpcionAEliminar(null)

    setCargando(true)
    startTransition(async () => {
      const resultado = await listarOpcionesUsuarioAction(usuarioSeleccionado)
      setOpciones(resultado)
      setCargando(false)
    })
  }

  const handleUsuarioChange = (value: string | null) => {
    const codigo = value ?? ''
    setUsuarioSeleccionado(codigo)
    if (!codigo) {
      setOpciones([])
      return
    }

    setCargando(true)
    startTransition(async () => {
      const resultado = await listarOpcionesUsuarioAction(codigo)
      setOpciones(resultado)
      setCargando(false)
    })
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-5xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Asignación de Opciones</h1>
          <p className="text-muted-foreground">
            Asignación de opciones y permisos a usuarios del sistema.
          </p>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <UsersIcon className="size-5 text-primary" weight="duotone" />
                Opciones Asignadas al Usuario
              </CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={abrirModal}>
                <PlusIcon className="size-4" weight="bold" />
                Asignar Opción
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 max-h-150 overflow-y-auto">
            {/* Selector de Usuario */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-muted-foreground">Usuario:</label>
              <Select value={usuarioSeleccionado} onValueChange={handleUsuarioChange}>
                <SelectTrigger className="w-80">
                  <SelectValue placeholder="Seleccionar usuario..." />
                </SelectTrigger>
                <SelectContent>
                  {usuarios.map((u) => (
                    <SelectItem key={u.codigo} value={u.codigo}>
                      <div className="flex items-center gap-2">
                        <UserIcon className="size-4" weight="duotone" />
                        <span>{u.nombre}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tabla de Opciones */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Módulo</TableHead>
                  <TableHead className="w-1/2">Opción</TableHead>
                  <TableHead className="w-16 text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cargando ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                      Cargando opciones...
                    </TableCell>
                  </TableRow>
                ) : opciones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                      No hay opciones asignadas.
                    </TableCell>
                  </TableRow>
                ) : (
                  opciones.map((opcion, index) => (
                    <TableRow key={`${opcion.codigoModulo}-${opcion.numeroItem}-${index}`}>
                      <TableCell>
                        <Badge variant="secondary">{opcion.modulo}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{opcion.opcion}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setOpcionAEliminar(opcion)}
                          aria-label="Eliminar opción"
                        >
                          <TrashIcon className="size-4 text-destructive" weight="bold" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal de Asignación */}
        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Asignación de Opciones</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleAsignar)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="select-modulo">Módulo</Label>
                <Controller
                  name="codigoModulo"
                  control={control}
                  render={({ field }) => {
                    const handleModuloSelectChange = (val: string | null) => {
                      field.onChange(val || '')
                    }
                    return (
                      <Select value={field.value} onValueChange={handleModuloSelectChange}>
                        <SelectTrigger id="select-modulo" className="w-full">
                          <SelectValue placeholder="Seleccionar módulo...">
                            {(value: string | null) =>
                              modulos.find((m) => m.codigo === value)?.descripcion ??
                              'Seleccionar módulo...'
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {modulos.map((m) => (
                            <SelectItem key={m.codigo} value={m.codigo}>
                              {m.descripcion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="select-opcion">Opción</Label>
                <Controller
                  name="numeroItem"
                  control={control}
                  render={({ field }) => {
                    const handleOpcionSelectChange = (val: string | null) => {
                      field.onChange(val || '')
                    }
                    return (
                      <Select
                        value={field.value}
                        onValueChange={handleOpcionSelectChange}
                        disabled={!codigoModulo}
                      >
                        <SelectTrigger id="select-opcion" className="w-full">
                          <SelectValue placeholder="Seleccionar opción...">
                            {(value: string | null) =>
                              opcionesDelModulo.find((o) => o.numeroItem === value)?.descripcion ??
                              (codigoModulo
                                ? 'Seleccionar opción...'
                                : 'Seleccione un módulo primero')
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {opcionesDelModulo.map((o) => (
                            <SelectItem
                              key={`${o.codigoModulo}-${o.numeroItem}`}
                              value={o.numeroItem}
                            >
                              {o.descripcion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="select-estado">Estado</Label>
                <Controller
                  name="estado"
                  control={control}
                  render={({ field }) => {
                    const handleEstadoSelectChange = (val: string | null) => {
                      field.onChange(val || '1')
                    }
                    return (
                      <Select value={field.value} onValueChange={handleEstadoSelectChange}>
                        <SelectTrigger id="select-estado" className="w-full">
                          <SelectValue placeholder="Seleccionar estado...">
                            {(value: string | null) =>
                              value === '1'
                                ? 'Activo'
                                : value === '0'
                                  ? 'Inactivo'
                                  : 'Seleccionar estado...'
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Activo</SelectItem>
                          <SelectItem value="0">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    )
                  }}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Asignar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Diálogo de confirmación de eliminación */}
        <AlertDialog open={!!opcionAEliminar} onOpenChange={(open) => !open && setOpcionAEliminar(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar esta opción?</AlertDialogTitle>
              <AlertDialogDescription>
                Se eliminará el permiso <strong>{opcionAEliminar?.modulo}</strong> /{' '}
                <strong>{opcionAEliminar?.opcion}</strong> del usuario seleccionado.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleEliminar}>Eliminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
