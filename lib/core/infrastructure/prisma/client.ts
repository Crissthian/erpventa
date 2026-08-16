import { PrismaClient } from '@prisma/client'
import { PrismaMssql } from '@prisma/adapter-mssql'

const config = {
  server: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 1433,
  database: process.env.DB_NAME || 'STHELI',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'mediocero123#',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    instanceName: process.env.DB_INSTANCE || undefined
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    const adapter = new PrismaMssql(config)
    return new PrismaClient({ adapter })
  })()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
export default prisma
