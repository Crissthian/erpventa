'use client'

import { UserIcon } from '@phosphor-icons/react'

export function UserDisplay({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-header-foreground/85 transition-colors">
      <UserIcon className="size-4" />
      <span>{name}</span>
    </div>
  )
}
