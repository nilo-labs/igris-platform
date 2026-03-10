import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.js'

const connectionString = 'postgresql://docker:docker@localhost:5433/igris'

const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
export { schema }
