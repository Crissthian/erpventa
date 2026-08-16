'use server'

import { GuardarUsuarioUseCase } from '@/auth/application/use-cases/guardar-usuario.use-case'
import { ListarUsuariosUseCase } from '@/auth/application/use-cases/listar-usuarios.use-case'
import { SqlUsuarioRepository } from '@/auth/infrastructure/adapters/sql-usuario.repository'
import { encrypt } from '@/auth/legacy-crypto'

export interface UsuarioDto {
  codigo: string
  nombre: string
  nivel: '1' | '2' | '3'
  activo: boolean
  puntosVenta: {
    guiasRemision: string
    factura: string
    boleta: string
    notaCreditoF: string
    notaCreditoB: string
    notaDebito: string
  }
}

export async function listarUsuariosAction(): Promise<UsuarioDto[]> {
  const repository = new SqlUsuarioRepository()
  const useCase = new ListarUsuariosUseCase(repository)
  const usuarios = await useCase.execute()

  return usuarios.map((u) => ({
    codigo: u.codigo,
    nombre: u.nombre,
    nivel: u.nivel,
    activo: u.activo,
    puntosVenta: u.puntosVenta
  }))
}

export interface GuardarUsuarioInput {
  codigo: string
  nombre: string
  nivel: '1' | '2' | '3'
  activo: boolean
  password: string
  puntosVenta: {
    guiasRemision: string
    factura: string
    boleta: string
    notaCreditoF: string
    notaCreditoB: string
    notaDebito: string
  }
}

export async function guardarUsuarioAction(
  input: GuardarUsuarioInput
): Promise<{ ok: boolean; error?: string }> {
  try {
    const repository = new SqlUsuarioRepository()
    const useCase = new GuardarUsuarioUseCase(repository)
    await useCase.execute({
      codigo: input.codigo,
      username: input.codigo,
      nombre: input.nombre,
      nivel: input.nivel,
      activo: input.activo,
      password: encrypt(input.password),
      puntosVenta: input.puntosVenta
    })
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Error desconocido al guardar usuario'
    }
  }
}