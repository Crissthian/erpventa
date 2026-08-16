'use client'

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore
} from 'react'

/** Modos de tema soportados */
export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  setTheme: () => {}
})

const STORAGE_KEY = 'erpventa-theme'
const VALID_THEMES: Theme[] = ['light', 'dark', 'system']

/** Aplica la clase dark al elemento html según el tema activo */
function applyTheme(theme: Theme) {
  const root = document.documentElement
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (theme === 'dark' || (theme === 'system' && prefersDark)) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/** Lee el tema desde localStorage validando valores permitidos */
function readThemeFromStorage(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && (VALID_THEMES as string[]).includes(stored)) {
      return stored as Theme
    }
  } catch {
    /* localStorage no disponible */
  }
  return 'system'
}

let listeners: Array<() => void> = []

/** Notifica a los suscriptores cuando cambia el tema en storage */
function emitChange() {
  for (const listener of listeners) listener()
}

/**
 * Almacén externo compatible con useSyncExternalStore.
 * Evita setState en effects: la lectura ocurre fuera del ciclo de React.
 */
const themeStore = {
  subscribe(listener: () => void) {
    listeners = [...listeners, listener]
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  },
  getSnapshot(): Theme {
    return readThemeFromStorage()
  },
  /** Valor SSR estable: siempre 'system' para evitar mismatch de hidratación */
  getServerSnapshot(): Theme {
    return 'system'
  },
  set(next: Theme) {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* localStorage no disponible */
    }
    emitChange()
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  /**
   * useSyncExternalStore garantiza consistencia entre SSR y cliente:
   * - Servidor → getServerSnapshot() = 'system' (estable, sin mismatch)
   * - Cliente  → getSnapshot() = valor real de localStorage
   */
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  )

  // Aplica la clase dark al DOM (efecto externo puro, sin setState)
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Escucha cambios del sistema operativo cuando el modo es 'system'
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    themeStore.set(next)
  }, [])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

/** Hook para consumir el tema actual */
export function useTheme() {
  return useContext(ThemeContext)
}
