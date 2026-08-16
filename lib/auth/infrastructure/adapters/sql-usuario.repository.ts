import {
  NivelAcceso,
  PuntosVenta,
  Usuario
} from '@/auth/domain/entities/usuario.entity'
import { UsuarioRepository } from '@/auth/domain/ports/usuario-repository.port'
import { prisma } from '@/core/infrastructure/prisma/client'

function mapearNivel(nivel: string | null): NivelAcceso {
  const n = (nivel ?? '').trim()
  if (n === '1' || n === '2' || n === '3') return n
  return '2'
}

function mapearPuntosVenta(row: {
  ptoVta: string | null
  ptoVtaf: string
  ptoVtab: string
  ptoVtanc: string
  ptoVtand: string
  ptoVtancb: string
}): PuntosVenta {
  return {
    guiasRemision: (row.ptoVta ?? '').trim(),
    factura: row.ptoVtaf.trim(),
    boleta: row.ptoVtab.trim(),
    notaCreditoF: row.ptoVtanc.trim(),
    notaCreditoB: row.ptoVtancb.trim(),
    notaDebito: row.ptoVtand.trim()
  }
}

function mapearUsuario(row: {
  codigo: string
  nombre: string
  nivel: string | null
  password: string
  activo: unknown
  ptoVta: string | null
  ptoVtaf: string
  ptoVtab: string
  ptoVtanc: string
  ptoVtand: string
  ptoVtancb: string
}): Usuario {
  return {
    codigo: row.codigo.trim(),
    username: row.codigo.trim(),
    password: row.password.trim(),
    nombre: row.nombre.trim(),
    nivel: mapearNivel(row.nivel),
    activo: Number(row.activo) === 1,
    puntosVenta: mapearPuntosVenta(row)
  }
}

export class SqlUsuarioRepository implements UsuarioRepository {
  async obtenerPorUsername(username: string): Promise<Usuario | null> {
    const row = await prisma.usuario.findUnique({
      where: { codigo: username.trim() }
    })
    if (!row) return null
    return mapearUsuario(row)
  }

  async listarTodos(): Promise<Usuario[]> {
    const rows = await prisma.usuario.findMany({ take: 500, orderBy: { codigo: 'asc' } })
    return rows.map(mapearUsuario)
  }

  async guardar(usuario: Usuario): Promise<void> {
    const codigo = usuario.codigo.trim().padEnd(10)
    const password = usuario.password.padEnd(10)

    await prisma.usuario.upsert({
      where: { codigo },
      update: {
        nombre: usuario.nombre,
        nivel: usuario.nivel,
        password,
        activo: usuario.activo ? 1 : 0,
        ptoVta: usuario.puntosVenta.guiasRemision.padEnd(3),
        ptoVtaf: usuario.puntosVenta.factura.padEnd(4),
        ptoVtab: usuario.puntosVenta.boleta.padEnd(4),
        ptoVtanc: usuario.puntosVenta.notaCreditoF.padEnd(4),
        ptoVtand: usuario.puntosVenta.notaDebito.padEnd(4),
        ptoVtancb: usuario.puntosVenta.notaCreditoB.padEnd(4)
      },
      create: {
        codigo,
        nombre: usuario.nombre,
        nivel: usuario.nivel,
        password,
        activo: usuario.activo ? 1 : 0,
        ptoVta: usuario.puntosVenta.guiasRemision.padEnd(3),
        ptoVtaf: usuario.puntosVenta.factura.padEnd(4),
        ptoVtab: usuario.puntosVenta.boleta.padEnd(4),
        ptoVtanc: usuario.puntosVenta.notaCreditoF.padEnd(4),
        ptoVtand: usuario.puntosVenta.notaDebito.padEnd(4),
        ptoVtancb: usuario.puntosVenta.notaCreditoB.padEnd(4)
      }
    })
  }
}
