import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const servers = pgTable('servers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  ipAddress: text('ip_address').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
