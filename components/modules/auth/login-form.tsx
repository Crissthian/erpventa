'use client'

import { loginAction } from '@/actions/auth.actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LockIcon, SignInIcon, UserIcon } from '@phosphor-icons/react'
import { useActionState } from 'react'

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null)

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <SignInIcon className="size-6 text-primary" weight="bold" aria-hidden="true" />
        </div>
        <CardTitle className="text-xl">ERPVenta</CardTitle>
        <CardDescription>Inicia sesión para continuar</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario</Label>
            <div className="relative">
              <UserIcon
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="admin"
                className="pl-9"
                autoComplete="username"
                aria-label="Usuario"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <LockIcon
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="pl-9"
                autoComplete="current-password"
                aria-label="Contraseña"
                required
              />
            </div>
          </div>
          {state?.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
