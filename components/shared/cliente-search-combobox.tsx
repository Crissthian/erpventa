'use client'

import { useState } from 'react'

import { Combobox } from '@base-ui/react/combobox'
import useSWR from 'swr'

import { buscarClientesAction } from '@/actions/cuentas-cobrar.actions'
import { useDebouncedValue } from '@/components/shared/use-debounced-value'
import { cn } from '@/lib/utils'
import type { ClienteSelectItem } from '@/ventas/domain/entities/cliente.entity'
import { CaretDownIcon, CheckIcon, SpinnerIcon } from '@phosphor-icons/react'

const MIN_CHARS = 3
const DEBOUNCE_MS = 400

interface ClienteSearchComboboxProps {
  value: ClienteSelectItem | null
  onValueChange: (cliente: ClienteSelectItem) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  'aria-invalid'?: boolean
  className?: string
}

export function ClienteSearchCombobox({
  value,
  onValueChange,
  placeholder = 'Buscar cliente por nombre, RUC o dirección...',
  disabled,
  id,
  className,
  ...rest
}: ClienteSearchComboboxProps) {
  const [inputValue, setInputValue] = useState('')
  const debounced = useDebouncedValue(inputValue, DEBOUNCE_MS)
  const term = debounced.trim()
  const shouldSearch = term.length >= MIN_CHARS

  const { data: results = [], isValidating } = useSWR<ClienteSelectItem[]>(
    shouldSearch ? (['clientes-buscar', term] as const) : null,
    async ([, t]: readonly [string, string]) => buscarClientesAction(t),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      dedupingInterval: DEBOUNCE_MS
    }
  )

  const showMinChars = !shouldSearch
  const showLoading = shouldSearch && isValidating && results.length === 0
  const showNoResults = shouldSearch && !isValidating && results.length === 0

  return (
    <Combobox.Root<ClienteSelectItem>
      value={value}
      onValueChange={(v: ClienteSelectItem | null) => {
        if (v) onValueChange(v)
      }}
      onInputValueChange={(v: string) => setInputValue(v)}
      items={shouldSearch ? results : []}
      itemToStringValue={(item) => item.ruc}
      itemToStringLabel={(item) => item.nombre}
    >
      <div className="relative">
        <Combobox.Input
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={rest['aria-invalid']}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs uppercase shadow-sm transition-colors outline-none',
            'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-secondary',
            'data-placeholder:text-muted-foreground',
            'aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20',
            'dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
            isValidating && shouldSearch && 'pr-16',
            className
          )}
        />
        {isValidating && shouldSearch && (
          <SpinnerIcon
            className="pointer-events-none absolute right-9 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-label="Buscando"
          />
        )}
        <Combobox.Trigger
          className="absolute right-1 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:text-foreground data-popup-open:rotate-180 transition-transform"
          aria-label="Abrir lista"
        >
          <CaretDownIcon className="size-4" />
        </Combobox.Trigger>
      </div>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4} className="isolate z-50">
          <Combobox.Popup className="z-50 max-h-80 w-(--anchor-width) overflow-y-auto rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-border data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 dark:ring-border/50">
            {showMinChars && (
              <div className="px-3 py-3 text-xs text-muted-foreground">
                Ingrese al menos {MIN_CHARS} caracteres para buscar.
              </div>
            )}
            {showLoading && (
              <div className="flex items-center gap-2 px-3 py-3 text-xs text-muted-foreground">
                <SpinnerIcon className="size-3.5 animate-spin" />
                Buscando...
              </div>
            )}
            {showNoResults && (
              <div className="px-3 py-3 text-xs text-muted-foreground">
                No se encontraron clientes.
              </div>
            )}
            {!showMinChars && !showLoading && !showNoResults && (
              <Combobox.List className="py-1">
                {results.map((cliente) => (
                  <Combobox.Item
                    key={cliente.ruc}
                    value={cliente}
                    className="relative flex cursor-default items-center gap-2 rounded-sm py-2 pr-8 pl-3 text-xs outline-none select-none transition-colors data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
                  >
                    <Combobox.ItemIndicator className="absolute right-2 flex size-4 items-center justify-center text-primary">
                      <CheckIcon className="size-4" />
                    </Combobox.ItemIndicator>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <span className="font-medium uppercase">{cliente.nombre}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {cliente.ruc} {cliente.direccion ? `· ${cliente.direccion}` : ''}
                      </span>
                    </div>
                  </Combobox.Item>
                ))}
              </Combobox.List>
            )}
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  )
}
