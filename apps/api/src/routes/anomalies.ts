import { db } from '@igris/database'
import { anomalies, servers } from '@igris/database/schema.js'
import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function anomaliesRoutes(app: FastifyInstance) {
  const anomalyBodySchema = z.object({
    serverId: z.string().uuid().describe('UUID do servidor monitorado'),
    cpuUsage: z
      .number()
      .describe('Porcentagem de uso da CPU no momento do alerta'),
    type: z
      .string()
      .describe('Origem do alerta (ex: CRITICAL_OVERRIDE, ISOLATION_FOREST)'),
    timestamp: z.string().datetime().describe('Data e hora exata do pico'),
  })

  app.post(
    '/anomalies',
    {
      schema: {
        summary: 'Registrar nova anomalia',
        description:
          'Recebe e armazena alertas de uso de CPU gerados pela AI Engine',
        tags: ['Anomalies'],
        body: anomalyBodySchema,
        response: {
          201: z
            .object({
              message: z.string(),
            })
            .describe('Alerta registrado com sucesso'),
          404: z
            .object({
              error: z.string(),
            })
            .describe('Servidor não encontrado'),
        },
      },
    },
    async (request, reply) => {
      const { serverId, cpuUsage, type, timestamp } = anomalyBodySchema.parse(
        request.body,
      )

      const serverExists = await db
        .select()
        .from(servers)
        .where(eq(servers.id, serverId))

      if (serverExists.length === 0) {
        return reply
          .status(404)
          .send({ error: 'Servidor nao encontrado no banco de dados.' })
      }

      await db.insert(anomalies).values({
        serverId,
        cpuUsage,
        type,
        timestamp: new Date(timestamp),
      })

      console.log(
        `🚨 [ALERTA RECEBIDO] Servidor ${serverId} | Tipo: ${type} | CPU: ${cpuUsage}%`,
      )

      return reply
        .status(201)
        .send({ message: 'Alerta crítico registrado com sucesso.' })
    },
  )
}
