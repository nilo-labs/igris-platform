import { db, schema } from '@igris/database'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const serverRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/servers',
    {
      schema: {
        description: 'Register a new server to be monitored',
        tags: ['Servers'],
        body: z.object({
          name: z.string().min(1, 'The server name is required'),
          ipAddress: z
            .string()
            .regex(
              /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
              'Must be a valid IPv4 address',
            ),
        }),
        response: {
          201: z.object({
            message: z.string(),
            serverId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, ipAddress } = request.body
      const [insertServer] = await db
        .insert(schema.servers)
        .values({
          name,
          ipAddress,
        })
        .returning({ insertId: schema.servers.id })

      if (!insertServer) {
        throw new Error('Falha: O banco não retornou o ID do servidor.')
      }

      return reply.status(201).send({
        message: 'Server registered successfully 🚀',
        serverId: insertServer.insertId,
      })
    },
  )
}
