'use client'

import {
  actualizarItemTablaAction,
  actualizarTablaAction,
  crearItemTablaAction,
  crearTablaAction,
  eliminarItemTablaAction,
  eliminarTablaAction,
  obtenerItemsTablaAction,
  obtenerTablasAction
} from '@/actions/tablas.actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
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
import {
  DotsThreeVerticalIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon
} from '@phosphor-icons/react'
import { useState } from 'react'
import useSWR, { mutate } from 'swr'

type TablaItem = {
  codigo: string
  descripcion: string
}

type ItemDetalle = {
  codigoTabla: string
  numeroItem: string
  descripcionItem: string | null
}

type DialogMode =
  | 'crear'
  | 'editar'
  | 'eliminar'
  | 'crearTabla'
  | 'editarTabla'
  | 'eliminarTabla'
  | null

function itemsKey(codigo: string) {
  return ['items-tabla', codigo]
}

export default function TablasPage() {
  const [selectedTabla, setSelectedTabla] = useState<string>('')
  const [selectedItem, setSelectedItem] = useState<string>('')
  const [searchTabla, setSearchTabla] = useState('')
  const [searchItem, setSearchItem] = useState('')
  const [dialogMode, setDialogMode] = useState<DialogMode>(null)
  const [editingItem, setEditingItem] = useState<ItemDetalle | null>(null)
  const [editingTabla, setEditingTabla] = useState<TablaItem | null>(null)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formNumeroItem, setFormNumeroItem] = useState('')
  const [formDescripcion, setFormDescripcion] = useState('')
  const [formTablaCodigo, setFormTablaCodigo] = useState('')
  const [formTablaDescripcion, setFormTablaDescripcion] = useState('')

  const { data: tablas = [], isLoading: loading } = useSWR<TablaItem[]>(
    'tablas',
    obtenerTablasAction,
    {
      onSuccess: (data) => {
        if (data.length > 0 && !selectedTabla) setSelectedTabla(data[0].codigo)
      }
    }
  )

  const { data: items = [], isLoading: loadingItems } = useSWR<ItemDetalle[]>(
    selectedTabla ? itemsKey(selectedTabla) : null,
    ([, codigo]: [string, string]) => obtenerItemsTablaAction(codigo)
  )

  const filteredTablas = tablas.filter(
    (t) =>
      t.codigo.toLowerCase().includes(searchTabla.toLowerCase()) ||
      t.descripcion.toLowerCase().includes(searchTabla.toLowerCase())
  )

  const filteredItems = items.filter(
    (i) =>
      i.numeroItem.toLowerCase().includes(searchItem.toLowerCase()) ||
      (i.descripcionItem ?? '').toLowerCase().includes(searchItem.toLowerCase())
  )

  const selectedTablaNombre = tablas.find((t) => t.codigo === selectedTabla)?.descripcion ?? ''

  function openCrear() {
    setFormNumeroItem('')
    setFormDescripcion('')
    setFormError('')
    setEditingItem(null)
    setDialogMode('crear')
  }

  function openEditar(item: ItemDetalle) {
    setFormNumeroItem(item.numeroItem)
    setFormDescripcion(item.descripcionItem ?? '')
    setFormError('')
    setEditingItem(item)
    setDialogMode('editar')
  }

  function openEliminar(item: ItemDetalle) {
    setEditingItem(item)
    setDialogMode('eliminar')
  }

  function openCrearTabla() {
    setFormTablaCodigo('')
    setFormTablaDescripcion('')
    setFormError('')
    setEditingTabla(null)
    setDialogMode('crearTabla')
  }

  function openEditarTabla(tabla: TablaItem) {
    setFormTablaCodigo(tabla.codigo)
    setFormTablaDescripcion(tabla.descripcion)
    setFormError('')
    setEditingTabla(tabla)
    setDialogMode('editarTabla')
  }

  function openEliminarTabla(tabla: TablaItem) {
    setEditingTabla(tabla)
    setDialogMode('eliminarTabla')
  }

  function closeDialog() {
    setDialogMode(null)
    setEditingItem(null)
    setEditingTabla(null)
    setFormError('')
    setFormTablaCodigo('')
    setFormTablaDescripcion('')
  }

  async function handleSubmitCrear() {
    if (!formNumeroItem.trim() || !formDescripcion.trim()) {
      setFormError('Todos los campos son requeridos')
      return
    }
    if (formNumeroItem.trim().length !== 3) {
      setFormError('El código debe ser exactamente 3 caracteres')
      return
    }
    setSubmitting(true)
    const fd = new FormData()
    fd.append('codigoTabla', selectedTabla)
    fd.append('numeroItem', formNumeroItem.trim().toUpperCase())
    fd.append('descripcionItem', formDescripcion.trim())
    const result = await crearItemTablaAction(null, fd)
    setSubmitting(false)
    if (result && 'error' in result) {
      setFormError(result.error ?? 'Error desconocido')
      return
    }
    await mutate(itemsKey(selectedTabla))
    closeDialog()
  }

  async function handleSubmitEditar() {
    if (!editingItem || !formDescripcion.trim()) {
      setFormError('La descripción es requerida')
      return
    }
    setSubmitting(true)
    const fd = new FormData()
    fd.append('codigoTabla', selectedTabla)
    fd.append('numeroItem', editingItem.numeroItem)
    fd.append('descripcionItem', formDescripcion.trim())
    const result = await actualizarItemTablaAction(null, fd)
    setSubmitting(false)
    if (result && 'error' in result) {
      setFormError(result.error ?? 'Error desconocido')
      return
    }
    await mutate(itemsKey(selectedTabla))
    closeDialog()
  }

  async function handleEliminar() {
    if (!editingItem) return
    setSubmitting(true)
    await eliminarItemTablaAction(selectedTabla, editingItem.numeroItem)
    setSubmitting(false)
    await mutate(itemsKey(selectedTabla))
    closeDialog()
  }

  async function handleSubmitCrearTabla() {
    if (!formTablaCodigo.trim() || !formTablaDescripcion.trim()) {
      setFormError('Todos los campos son requeridos')
      return
    }
    if (formTablaCodigo.trim().length !== 3) {
      setFormError('El código debe ser exactamente 3 caracteres')
      return
    }
    setSubmitting(true)
    const fd = new FormData()
    fd.append('codigo', formTablaCodigo.trim().toUpperCase())
    fd.append('descripcion', formTablaDescripcion.trim())
    const result = await crearTablaAction(null, fd)
    setSubmitting(false)
    if (result && 'error' in result) {
      setFormError(result.error ?? 'Error desconocido')
      return
    }
    await mutate('tablas')
    setSelectedTabla(formTablaCodigo.trim().toUpperCase())
    closeDialog()
  }

  async function handleSubmitEditarTabla() {
    if (!editingTabla || !formTablaDescripcion.trim()) {
      setFormError('El nombre es requerido')
      return
    }
    setSubmitting(true)
    const fd = new FormData()
    fd.append('codigo', editingTabla.codigo)
    fd.append('descripcion', formTablaDescripcion.trim())
    const result = await actualizarTablaAction(null, fd)
    setSubmitting(false)
    if (result && 'error' in result) {
      setFormError(result.error ?? 'Error desconocido')
      return
    }
    await mutate('tablas')
    closeDialog()
  }

  async function handleEliminarTabla() {
    if (!editingTabla) return
    setSubmitting(true)
    const result = await eliminarTablaAction(editingTabla.codigo)
    setSubmitting(false)
    if (result && 'error' in result) {
      setFormError(result.error ?? 'Error desconocido')
      return
    }
    const siguiente = tablas.find((t) => t.codigo !== editingTabla.codigo)
    await mutate('tablas')
    setSelectedTabla(siguiente?.codigo ?? '')
    closeDialog()
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Mantenimiento de Tablas</h1>
        <p className="text-muted-foreground">
          Configuración y administración de tablas del sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Tablas</CardTitle>
              <Button variant="default" size="sm" onClick={openCrearTabla}>
                <PlusIcon className="size-4" />
                Nuevo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tabla..."
                value={searchTabla}
                onChange={(e) => setSearchTabla(e.target.value)}
                className="pl-9 uppercase"
                aria-label="Buscar tabla"
              />
            </div>

            <div className="border rounded-md max-h-120 overflow-y-auto">
              <Table className="text-sm">
                <TableHeader className="sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="h-9  w-[25%]">Código</TableHead>
                    <TableHead className="h-9  w-[70%]">Nombre</TableHead>
                    <TableHead className="h-9  w-[5%] text-right" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : filteredTablas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        Sin resultados
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTablas.map((tabla) => (
                      <TableRow key={tabla.codigo} onClick={() => setSelectedTabla(tabla.codigo)}>
                        <TableCell className=" font-medium">{tabla.codigo}</TableCell>
                        <TableCell>{tabla.descripcion}</TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  aria-label={`Acciones para tabla ${tabla.codigo}`}
                                >
                                  <DotsThreeVerticalIcon className="size-4" />
                                </Button>
                              }
                            />
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openEditarTabla(tabla)
                                }}
                              >
                                <PencilIcon className="mr-2 size-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openEliminarTabla(tabla)
                                }}
                              >
                                <TrashIcon className="mr-2 size-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>{selectedTablaNombre || 'Registros'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar registro..."
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                className="pl-9 uppercase"
                aria-label="Buscar registro"
              />
            </div>

            <div className="border rounded-md max-h-105 overflow-y-auto">
              <Table className="text-sm">
                <TableHeader className="sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="h-9  w-20">Código</TableHead>
                    <TableHead className="h-9 ">Descripción</TableHead>
                    <TableHead className="h-9  w-20 text-right" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingItems ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        Sin registros
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow
                        key={item.numeroItem}
                        className={`hover:bg-secondary/50 cursor-pointer ${
                          selectedItem === item.numeroItem
                            ? 'bg-primary/10 hover:bg-primary/15'
                            : ''
                        }`}
                        onClick={() => setSelectedItem(item.numeroItem)}
                      >
                        <TableCell className=" font-medium">{item.numeroItem}</TableCell>
                        <TableCell className="">{item.descripcionItem}</TableCell>
                        <TableCell className=" text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  aria-label={`Acciones para registro ${item.numeroItem}`}
                                >
                                  <DotsThreeVerticalIcon className="size-4" />
                                </Button>
                              }
                            />
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openEditar(item)
                                }}
                              >
                                <PencilIcon className="mr-2 size-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openEliminar(item)
                                }}
                              >
                                <TrashIcon className="mr-2 size-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="default" size="sm" onClick={openCrear}>
                <PlusIcon className="size-4" />
                Nuevo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && closeDialog()}>
        {/* DialogTrigger oculto requerido por @base-ui/react para gestión de foco */}
        <DialogTrigger style={{ display: 'none' }} aria-hidden />
        <DialogContent>
          {dialogMode === 'crear' && (
            <>
              <DialogHeader>
                <DialogTitle>Nuevo Registro</DialogTitle>
                <DialogDescription>
                  Agregar un nuevo registro a {selectedTablaNombre}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="numeroItem">Código</Label>
                  <Input
                    id="numeroItem"
                    maxLength={3}
                    placeholder="Ej: 001"
                    value={formNumeroItem}
                    aria-label="Código del registro"
                    onChange={(e) => setFormNumeroItem(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcionCrear">Descripción</Label>
                  <Input
                    id="descripcionCrear"
                    maxLength={250}
                    placeholder="Descripción del registro"
                    value={formDescripcion}
                    aria-label="Descripción del registro"
                    onChange={(e) => setFormDescripcion(e.target.value)}
                  />
                </div>
                {formError && <p className="text-sm text-destructive">{formError}</p>}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmitCrear} disabled={submitting}>
                  {submitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </DialogFooter>
            </>
          )}

          {dialogMode === 'editar' && editingItem && (
            <>
              <DialogHeader>
                <DialogTitle>Editar Registro</DialogTitle>
                <DialogDescription>
                  Modificar registro {editingItem.numeroItem} de {selectedTablaNombre}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="codigoEditar">Código</Label>
                  <Input
                    id="codigoEditar"
                    value={editingItem.numeroItem}
                    disabled
                    aria-label="Código del registro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcionEditar">Descripción</Label>
                  <Input
                    id="descripcionEditar"
                    maxLength={250}
                    value={formDescripcion}
                    aria-label="Descripción del registro"
                    onChange={(e) => setFormDescripcion(e.target.value)}
                  />
                </div>
                {formError && <p className="text-sm text-destructive">{formError}</p>}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmitEditar} disabled={submitting}>
                  {submitting ? 'Actualizando...' : 'Actualizar'}
                </Button>
              </DialogFooter>
            </>
          )}

          {dialogMode === 'eliminar' && editingItem && (
            <>
              <DialogHeader>
                <DialogTitle>Eliminar Registro</DialogTitle>
                <DialogDescription>
                  ¿Está seguro de eliminar el registro{' '}
                  <span className="font-semibold text-foreground">{editingItem.numeroItem}</span> -{' '}
                  <span className="font-semibold text-foreground">
                    {editingItem.descripcionItem}
                  </span>{' '}
                  de {selectedTablaNombre}?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleEliminar} disabled={submitting}>
                  {submitting ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </DialogFooter>
            </>
          )}

          {dialogMode === 'crearTabla' && (
            <>
              <DialogHeader>
                <DialogTitle>Nueva Tabla</DialogTitle>
                <DialogDescription>Crear una nueva tabla de configuración</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="codigoTabla">Código</Label>
                  <Input
                    id="codigoTabla"
                    maxLength={3}
                    placeholder="Ej: TIP"
                    value={formTablaCodigo}
                    aria-label="Código de la tabla"
                    onChange={(e) => setFormTablaCodigo(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombreTabla">Nombre</Label>
                  <Input
                    id="nombreTabla"
                    maxLength={30}
                    placeholder="Nombre de la tabla"
                    value={formTablaDescripcion}
                    aria-label="Nombre de la tabla"
                    onChange={(e) => setFormTablaDescripcion(e.target.value)}
                  />
                </div>
                {formError && <p className="text-sm text-destructive">{formError}</p>}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmitCrearTabla} disabled={submitting}>
                  {submitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </DialogFooter>
            </>
          )}

          {dialogMode === 'editarTabla' && editingTabla && (
            <>
              <DialogHeader>
                <DialogTitle>Editar Tabla</DialogTitle>
                <DialogDescription>
                  Modificar nombre de la tabla {editingTabla.codigo}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="codigoTablaEditar">Código</Label>
                  <Input
                    id="codigoTablaEditar"
                    value={editingTabla.codigo}
                    disabled
                    aria-label="Código de la tabla"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombreTablaEditar">Nombre</Label>
                  <Input
                    id="nombreTablaEditar"
                    maxLength={30}
                    value={formTablaDescripcion}
                    aria-label="Nombre de la tabla"
                    onChange={(e) => setFormTablaDescripcion(e.target.value)}
                  />
                </div>
                {formError && <p className="text-sm text-destructive">{formError}</p>}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmitEditarTabla} disabled={submitting}>
                  {submitting ? 'Actualizando...' : 'Actualizar'}
                </Button>
              </DialogFooter>
            </>
          )}

          {dialogMode === 'eliminarTabla' && editingTabla && (
            <>
              <DialogHeader>
                <DialogTitle>Eliminar Tabla</DialogTitle>
                <DialogDescription>
                  ¿Está seguro de eliminar la tabla{' '}
                  <span className="font-semibold text-foreground">{editingTabla.codigo}</span> -{' '}
                  <span className="font-semibold text-foreground">{editingTabla.descripcion}</span>?
                  Esta acción también eliminará todos sus registros.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleEliminarTabla} disabled={submitting}>
                  {submitting ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
