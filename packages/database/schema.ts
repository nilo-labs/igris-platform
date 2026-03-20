import { pgTable, real, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const servers = pgTable('servers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  ipAddress: text('ip_address').notNull(),
  lastPingAt: timestamp('last_ping_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const anomalies = pgTable('anomalies', {
  id: uuid('id').defaultRandom().primaryKey(),
  serverId: uuid('server_id')
    .references(() => servers.id)
    .notNull(),
  cpuUsage: real('cpu_usage').notNull(),
  type: text('type').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
