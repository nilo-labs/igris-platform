import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/ping',
    {
      schema: {
        description: 'Health Check endpoint to verify if the API is online',
        tags: ['Health'],
        response: {
          200: z.object({
            status: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async () => {
      return {
        status: 'ok',
        message: 'Igris API is online',
      }
    },
  )
}
