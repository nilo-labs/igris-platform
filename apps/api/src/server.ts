import cors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { anomalies, servers } from '@igris/database/schema.js'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { anomaliesRoutes } from './routes/anomalies.js'
import { healthRoutes } from './routes/health.js'
import { logsRoutes } from './routes/logs.js'
import { serverRoutes } from './routes/server.js'

const app = fastify({ logger: true })

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Igris API',
      description: 'The knight that protects your servers.',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(cors, {
  origin: true,
})

app.register(healthRoutes)
app.register(logsRoutes)
app.register(serverRoutes)
app.register(anomaliesRoutes)

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' })
    console.log('🚀 [Igris API] HTTP Server running on http://localhost:3333')
    console.log(
      '📚 [Igris API] Swagger UI running on http://localhost:3333/docs',
    )
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
