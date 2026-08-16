'use client'

import { logoutAction } from '@/actions/auth.actions'
import { SignOutIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="text-header-foreground/85 hover:bg-header-foreground/10 hover:text-header-foreground"
      >
        <SignOutIcon className="size-4" aria-hidden="true" />
        Cerrar sesión
      </Button>
    </form>
  )
}
