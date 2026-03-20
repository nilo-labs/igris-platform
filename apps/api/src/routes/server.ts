import { REPL_MODE_STRICT } from 'node:repl'
import { db, schema } from '@igris/database'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const serverRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/servers',
    {
      schema: {
        summary: 'Criar novo servidor',
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

  app.get(
    '/servers',
    {
      schema: {
        summary: 'Buscar todos os servidores',
        description:
          'Retorna a lista de servidores monitorados pela plataforma',
        tags: ['Servers'],
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              name: z.string(),
              ipAddress: z.string(),
              status: z.string(),
            }),
          ),
        },
      },
    },
    async (request, reply) => {
      const rawServers = await db.select().from(schema.servers)

      const formattedServers = rawServers.map((server) => ({
        id: server.id,
        name: server.name,
        ipAddress: server.ipAddress,
        status: 'Ativo',
      }))

      return reply.status(200).send(formattedServers)
    },
  )
}
