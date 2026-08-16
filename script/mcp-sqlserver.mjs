import sql from 'mssql'
import { z } from 'zod/v4'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

function getConfig() {
  const port = Number(process.env.DB_PORT || '1433')

  if (!process.env.DB_USER) throw new Error('Missing DB_USER')
  if (!process.env.DB_PASSWORD) throw new Error('Missing DB_PASSWORD')
  if (!process.env.DB_HOST) throw new Error('Missing DB_HOST')
  if (!process.env.DB_NAME) throw new Error('Missing DB_NAME')
  if (Number.isNaN(port)) throw new Error('Invalid DB_PORT')

  const instanceName = process.env.DB_INSTANCE?.trim()

  return {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      ...(instanceName ? { instanceName } : {})
    },
    pool: {
      max: 5,
      min: 0,
      idleTimeoutMillis: 30000
    }
  }
}

// Pool lazy con reconexión automática
let pool = null
let connecting = null

async function getPool() {
  if (pool?.connected) {
    return pool
  }

  if (connecting) {
    return connecting
  }

  if (pool) {
    await pool.close().catch(() => {})
    pool = null
  }

  connecting = sql.connect(getConfig())
  pool = await connecting
  connecting = null
  return pool
}

async function queryDatabase(query, inputs = {}) {
  try {
    const conn = await getPool()
    const request = conn.request()

    for (const [key, value] of Object.entries(inputs)) {
      request.input(key, value)
    }

    return request.query(query)
  } catch (err) {
    // Si la conexión se cerró, reseteamos el pool e intentamos de nuevo
    if (err.message?.includes('Connection closed') || err.message?.includes('Failed to connect')) {
      pool = null
      connecting = null
      const conn = await getPool()
      const request = conn.request()

      for (const [key, value] of Object.entries(inputs)) {
        request.input(key, value)
      }

      return request.query(query)
    }
    throw err
  }
}

const server = new McpServer({
  name: 'sqlserver',
  version: '1.0.0'
})

server.registerTool(
  'list_tables',
  {
    description: 'List base tables from the configured SQL Server database',
    inputSchema: {
      schema: z.string().optional().describe('Optional schema name, for example dbo')
    }
  },
  async ({ schema }) => {
    const result = await queryDatabase(
      `SELECT TABLE_SCHEMA, TABLE_NAME
       FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_TYPE = 'BASE TABLE'
         AND (@schema IS NULL OR TABLE_SCHEMA = @schema)
       ORDER BY TABLE_SCHEMA, TABLE_NAME`,
      { schema: schema ?? null }
    )

    const tables = result.recordset.map((row) => `${row.TABLE_SCHEMA}.${row.TABLE_NAME}`)

    return {
      content: [
        {
          type: 'text',
          text: tables.length ? tables.join('\n') : 'No tables found.'
        }
      ],
      structuredContent: {
        tables
      }
    }
  }
)

server.registerTool(
  'describe_table',
  {
    description: 'Describe columns for a specific table',
    inputSchema: {
      schema: z.string().default('dbo').describe('Schema name, defaults to dbo'),
      table: z.string().describe('Table name')
    }
  },
  async ({ schema, table }) => {
    const result = await queryDatabase(
      `SELECT
         COLUMN_NAME,
         DATA_TYPE,
         CHARACTER_MAXIMUM_LENGTH,
         NUMERIC_PRECISION,
         NUMERIC_SCALE,
         IS_NULLABLE,
         COLUMN_DEFAULT
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = @schema
         AND TABLE_NAME = @table
       ORDER BY ORDINAL_POSITION`,
      { schema, table }
    )

    const columns = result.recordset.map((row) => ({
      column: row.COLUMN_NAME,
      type: row.DATA_TYPE,
      maxLength: row.CHARACTER_MAXIMUM_LENGTH,
      precision: row.NUMERIC_PRECISION,
      scale: row.NUMERIC_SCALE,
      nullable: row.IS_NULLABLE,
      defaultValue: row.COLUMN_DEFAULT
    }))

    return {
      content: [
        {
          type: 'text',
          text: columns.length
            ? columns
                .map((column) => `${column.column} | ${column.type} | nullable=${column.nullable}`)
                .join('\n')
            : `No columns found for ${schema}.${table}.`
        }
      ],
      structuredContent: {
        schema,
        table,
        columns
      }
    }
  }
)

server.registerTool(
  'run_query',
  {
    description: 'Run a read-only SQL query against SQL Server',
    inputSchema: {
      query: z.string().describe('SELECT query to execute')
    }
  },
  async ({ query }) => {
    if (!/^\s*select\b/i.test(query)) {
      return {
        content: [
          {
            type: 'text',
            text: 'Only SELECT queries are allowed.'
          }
        ],
        isError: true
      }
    }

    const result = await queryDatabase(query)

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result.recordset, null, 2)
        }
      ],
      structuredContent: {
        rows: result.recordset,
        count: result.recordset.length
      }
    }
  }
)

async function shutdown() {
  if (pool) {
    await pool.close().catch(() => {})
    pool = null
    connecting = null
  }
}

const transport = new StdioServerTransport()

try {
  await server.connect(transport)
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  await shutdown()
  process.exit(1)
}

process.on('SIGINT', async () => {
  await shutdown()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await shutdown()
  process.exit(0)
})

// Limpieza cuando el canal stdio se cierre (cliente MCP se desconecta)
process.stdin.on('close', async () => {
  await shutdown()
  process.exit(0)
})
