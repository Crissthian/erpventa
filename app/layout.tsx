import { ThemeProvider } from '@/components/shared/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Geist, Geist_Mono as GeistMono } from 'next/font/google'
import Script from 'next/script'
import { ReactNode } from 'react'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = GeistMono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'ERPVenta',
  description: 'Sistema ERP de ventas'
}

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('erpventa-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'dark' || (!t && prefersDark) || (t === 'system' && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
`.trim()

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn('h-full', 'antialiased', geistSans.variable, geistMono.variable)}
    >
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
