import sql from 'mssql'

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_HOST!,
  database: process.env.DB_NAME!,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    instanceName: process.env.DB_INSTANCE || undefined
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
}

const globalForDb = globalThis as unknown as {
  mssqlPool: sql.ConnectionPool | undefined
}

/** Obtiene o crea el pool de conexiones SQL Server (singleton global). */
export async function getDbPool(): Promise<sql.ConnectionPool> {
  if (globalForDb.mssqlPool?.connected) return globalForDb.mssqlPool
  globalForDb.mssqlPool = await new sql.ConnectionPool(config).connect()
  return globalForDb.mssqlPool
}
