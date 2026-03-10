import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

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
        },
      },
    },
    async (request, reply) => {
      const { serverId, cpuUsage, memoryUsage, timestamp } = request.body

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
