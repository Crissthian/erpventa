'use server'

import { redirect } from 'next/navigation'
import { loginSchema } from '@/validators/auth.schema'
import { AutenticarUsuarioUseCase } from '@/auth/application/use-cases/autenticar-usuario.use-case'
import { SqlUsuarioRepository } from '@/auth/infrastructure/adapters/sql-usuario.repository'
import { createSession } from '@/auth/session'

export async function loginAction(_prevState: unknown, formData: FormData) {
  const raw = {
    username: formData.get('username'),
    password: formData.get('password')
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const repository = new SqlUsuarioRepository()
  const useCase = new AutenticarUsuarioUseCase(repository)

  const resultado = await useCase.execute(parsed.data.username, parsed.data.password)

  if (!resultado.ok) {
    if (resultado.razon === 'bloqueado') {
      return { error: 'Usuario bloqueado. Contacte al administrador.' }
    }
    return { error: 'Usuario o contraseña incorrectos' }
  }

  await createSession({
    userId: resultado.usuario.codigo,
    username: resultado.usuario.username,
    name: resultado.usuario.nombre ?? resultado.usuario.username
  })
  redirect('/')
}

export async function logoutAction() {
  const { destroySession } = await import('@/lib/auth/session')
  await destroySession()
  redirect('/login')
}
