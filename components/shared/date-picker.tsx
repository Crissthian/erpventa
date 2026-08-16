'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldLabel } from '@/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  'aria-invalid'?: boolean
}

function toIsoString(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function DatePicker({ id, label, value, onChange, ...rest }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const date = value ? new Date(`${value}T00:00:00`) : undefined
  const safeDate = date && !Number.isNaN(date.getTime()) ? date : undefined

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              type="button"
              variant="outline"
              aria-invalid={rest['aria-invalid']}
              className={cn(
                'w-full justify-start font-normal',
                !safeDate && 'text-muted-foreground'
              )}
            >
              {safeDate ? format(safeDate, 'dd/MM/yyyy', { locale: es }) : 'Seleccionar fecha'}
            </Button>
          }
        />
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={safeDate}
            defaultMonth={safeDate}
            captionLayout="dropdown"
            onSelect={(d) => {
              onChange(d ? toIsoString(d) : '')
              if (d) setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
