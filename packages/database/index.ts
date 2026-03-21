import process from 'node:process'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.js'

const connectionString =
  process.env.DATABASE_URL || 'postgresql://docker:docker@localhost:5433/igris'

console.log(
  '🔗 API tentando conectar em:',
  connectionString.includes('postgres:5432')
    ? 'REDE DOCKER'
    : 'LOCALHOST WINDOWS',
)

const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
export { schema }
