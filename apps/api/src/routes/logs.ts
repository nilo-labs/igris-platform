import { db, schema } from '@igris/database'
import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { Point, writeApi } from '../lib/influx.js'

export const logsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/logs',
    {
      schema: {
        description: 'Ingest infrastructure logs from client servers',
        tags: ['Logs'],
        body: z.object({
          serverId: z.string().uuid('The server ID must be a valid UUID'),
          cpuUsage: z.number().min(0).max(100),
          memoryUsage: z.number().min(0).max(100),
          timestamp: z.string().datetime(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            data: z.object({
              serverId: z.string(),
              cpuUsage: z.number(),
              memoryUsage: z.number(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { serverId, cpuUsage, memoryUsage, timestamp } = request.body

      const [serverExists] = await db
        .select()
        .from(schema.servers)
        .where(eq(schema.servers.id, serverId))

      if (!serverExists) {
        return reply.status(404).send({
          message: 'Access Denied: Server not found in the registry.',
        })
      }

      const point = new Point('system_metrics')
        .tag('serverId', serverId)
        .floatField('cpuUsage', cpuUsage)
        .floatField('memoryUsage', memoryUsage)
        .timestamp(new Date(timestamp))

      writeApi.writePoint(point)
      await writeApi.flush()

      return reply.status(201).send({
        message: 'Log successfully ingested',
        data: {
          serverId,
          cpuUsage,
          memoryUsage,
        },
      })
    },
  )
}
