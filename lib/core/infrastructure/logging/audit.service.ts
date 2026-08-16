/**
 * Servicio transversal de auditoría para registrar operaciones críticas de escritura.
 */
export class AuditService {
  async log(usuarioCodigo: string, accion: string, detalles: string): Promise<void> {
    const fecha = new Date().toISOString()
    // Registra la auditoría en los logs del servidor
    console.log(
      `[AUDITORIA] [${fecha}] Usuario: ${usuarioCodigo} | Acción: ${accion} | Detalles: ${detalles}`
    )
  }
}

export const auditService = new AuditService()
