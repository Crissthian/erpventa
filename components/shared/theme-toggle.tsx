'use client'

import { useTheme, type Theme } from '@/components/shared/theme-provider'
import { DesktopIcon, MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'

const OPTIONS: { value: Theme; label: string; Icon: React.ElementType }[] = [
  { value: 'light', label: 'Claro', Icon: SunIcon },
  { value: 'dark', label: 'Oscuro', Icon: MoonIcon },
  { value: 'system', label: 'Automático', Icon: DesktopIcon }
]

/** Botón con dropdown para seleccionar el tema de la aplicación */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[2]
  const CurrentIcon = current.Icon

  return (
    <div ref={ref} className="relative">
      <button
        id="theme-toggle-btn"
        aria-label="Cambiar tema"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-header-foreground transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <CurrentIcon size={18} weight="bold" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Seleccionar tema"
          className="absolute right-0 top-10 z-50 min-w-36 rounded-md border border-border bg-popover py-1 shadow-md"
        >
          {OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              role="option"
              aria-selected={theme === value}
              onClick={() => {
                setTheme(value)
                setOpen(false)
              }}
              className={[
                'flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors',
                theme === value
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-popover-foreground hover:bg-accent hover:text-accent-foreground'
              ].join(' ')}
            >
              <Icon size={15} weight={theme === value ? 'bold' : 'regular'} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
