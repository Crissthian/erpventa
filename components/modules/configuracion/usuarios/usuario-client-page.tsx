'use client'

import { useMemo, useState } from 'react'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  guardarUsuarioAction,
  listarUsuariosAction,
  type UsuarioDto
} from '@/actions/usuarios.actions'
import { Badge } from '@/components/ui/badge'
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
import { usuarioFormSchema, type UsuarioFormData } from '@/validators/usuario.schema'
import {
  FloppyDiskIcon,
  LockKeyIcon,
  MagnifyingGlassIcon,
  StorefrontIcon,
  UserIcon,
  XCircleIcon
} from '@phosphor-icons/react'

const NIVEL_LABELS: Record<string, string> = {
  '1': 'SUPERVISOR',
  '2': 'OPERADOR',
  '3': 'SEGURIDAD'
}

const PUNTOS_VENTA_ORDEN: (keyof UsuarioFormData['puntosVenta'])[] = [
  'guiasRemision',
  'factura',
  'boleta',
  'notaCreditoF',
  'notaCreditoB',
  'notaDebito'
]

const PUNTOS_VENTA_NOMBRES: Record<keyof UsuarioFormData['puntosVenta'], string> = {
  guiasRemision: 'GUIAS REMISION',
  factura: 'FACTURA',
  boleta: 'BOLETA',
  notaCreditoF: 'NOTA CREDITO F',
  notaCreditoB: 'NOTA CREDITO B',
  notaDebito: 'NOTA DEBITO'
}

const defaultValues: UsuarioFormData = {
  login: '',
  nombre: '',
  nivelAcceso: '2',
  activo: true,
  password: '',
  puntosVenta: {
    guiasRemision: '',
    factura: '',
    boleta: '',
    notaCreditoF: '',
    notaCreditoB: '',
    notaDebito: ''
  }
}

interface UsuarioClientPageProps {
  usuariosIniciales: UsuarioDto[]
}

export function UsuarioClientPage({ usuariosIniciales }: UsuarioClientPageProps) {
  const [usuarios, setUsuarios] = useState<UsuarioDto[]>(usuariosIniciales)
  const [busqueda, setBusqueda] = useState('')
  const [guardando, setGuardando] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UsuarioFormData>({
    resolver: standardSchemaResolver(usuarioFormSchema),
    defaultValues
  })

  async function cargarUsuarios() {
    const data = await listarUsuariosAction()
    setUsuarios(data)
  }

  const usuariosFiltrados = useMemo(
    () =>
      usuarios.filter(
        (u) =>
          u.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
          u.nombre.toLowerCase().includes(busqueda.toLowerCase())
      ),
    [usuarios, busqueda]
  )

  function cargarUsuarioEnFormulario(usuario: UsuarioDto) {
    reset({
      login: usuario.codigo,
      nombre: usuario.nombre,
      nivelAcceso: usuario.nivel,
      activo: usuario.activo,
      password: '',
      puntosVenta: usuario.puntosVenta
    })
  }

  function limpiarFormulario() {
    reset(defaultValues)
  }

  async function handleFormSubmit(data: UsuarioFormData) {
    setGuardando(true)

    const result = await guardarUsuarioAction({
      codigo: data.login,
      nombre: data.nombre,
      nivel: data.nivelAcceso,
      activo: data.activo,
      password: data.password,
      puntosVenta: data.puntosVenta
    })

    setGuardando(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Usuario guardado correctamente')
    await cargarUsuarios()
    reset(defaultValues)
  }

  function handleNivelChange(onChange: (value: '1' | '2' | '3') => void) {
    return (value: '1' | '2' | '3' | null) => {
      if (value) onChange(value)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">Administración de usuarios y cuentas del sistema.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Formulario */}
        <Card className="shadow-sm xl:col-span-5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <UserIcon className="size-5 text-primary" weight="duotone" />
              Datos del Usuario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="login">Usuario de Acceso</Label>
                  <Input
                    id="login"
                    placeholder="Usuario de acceso"
                    className="uppercase"
                    aria-label="Login del usuario"
                    {...register('login')}
                  />
                  {errors.login && (
                    <p className="text-xs text-destructive">{errors.login.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Usuario</Label>
                  <Input
                    id="nombre"
                    placeholder="Nombre completo"
                    aria-label="Nombre del usuario"
                    {...register('nombre')}
                  />
                  {errors.nombre && (
                    <p className="text-xs text-destructive">{errors.nombre.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nivelAcceso">Nivel Acceso</Label>
                  <Controller
                    name="nivelAcceso"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={handleNivelChange(field.onChange)}>
                        <SelectTrigger
                          id="nivelAcceso"
                          aria-label="Nivel de acceso"
                          className="w-full"
                        >
                          <SelectValue placeholder="Seleccionar...">
                            {field.value ? NIVEL_LABELS[field.value] : undefined}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">SUPERVISOR</SelectItem>
                          <SelectItem value="2">OPERADOR</SelectItem>
                          <SelectItem value="3">SEGURIDAD</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.nivelAcceso && (
                    <p className="text-xs text-destructive">{errors.nivelAcceso.message}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Controller
                    name="activo"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id="activo"
                        checked={field.value}
                        onCheckedChange={(value) => field.onChange(value === true)}
                        aria-label="Usuario activo"
                      />
                    )}
                  />
                  <Label htmlFor="activo" className="font-normal">
                    Activo
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockKeyIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Contraseña"
                      className="pl-9"
                      aria-label="Contraseña del usuario"
                      {...register('password')}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <StorefrontIcon className="size-4 text-muted-foreground" />
                  Puntos de Venta
                </Label>
                <div className="rounded-md border bg-secondary/30 p-3">
                  <div className="grid grid-cols-1 gap-2">
                    {PUNTOS_VENTA_ORDEN.map((codigo) => (
                      <div key={codigo} className="grid grid-cols-[1fr_auto] items-center gap-2">
                        <Label htmlFor={`pv-${codigo}`} className="truncate text-sm font-normal">
                          {PUNTOS_VENTA_NOMBRES[codigo]}
                        </Label>
                        <Input
                          id={`pv-${codigo}`}
                          className="h-8 w-24 text-right text-sm"
                          aria-label={`Punto de venta ${PUNTOS_VENTA_NOMBRES[codigo]}`}
                          {...register(`puntosVenta.${codigo}`)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 py-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={limpiarFormulario}
                    disabled={guardando}
                  >
                    <XCircleIcon className="mr-2 size-4" />
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={guardando}>
                    <FloppyDiskIcon className="mr-2 size-4" />
                    {guardando ? 'Guardando...' : 'Guardar'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card className="shadow-sm xl:col-span-7">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Listado de Usuarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por login o nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9"
                aria-label="Buscar usuario"
              />
            </div>

            <div className="rounded-md border">
              <div className="max-h-128 overflow-auto">
                <Table className="text-sm">
                  <TableHeader className="sticky top-0 z-10 bg-table-header">
                    <TableRow>
                      <TableHead className="h-9 ">Usuario de Acceso</TableHead>
                      <TableHead className="h-9 ">Nombre del Usuario</TableHead>
                      <TableHead className="h-9 ">Nivel</TableHead>
                      <TableHead className="h-9  text-center">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuariosFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          Sin resultados
                        </TableCell>
                      </TableRow>
                    ) : (
                      usuariosFiltrados.map((usuario) => (
                        <TableRow
                          key={usuario.codigo}
                          className="cursor-pointer hover:bg-table-row-hover"
                          onClick={() => cargarUsuarioEnFormulario(usuario)}
                        >
                          <TableCell className=" font-medium">{usuario.codigo}</TableCell>
                          <TableCell className="">{usuario.nombre}</TableCell>
                          <TableCell className="">
                            {NIVEL_LABELS[usuario.nivel] ?? usuario.nivel}
                          </TableCell>
                          <TableCell className=" text-center">
                            <Badge variant={usuario.activo ? 'success' : 'secondary'}>
                              {usuario.activo ? 'Activo' : 'Inactivo'}
                            </Badge>
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
