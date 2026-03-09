import fastify from 'fastify'

const app = fastify({ logger: true })

app.get('/ping', async () => {
  return {
    status: 'ok',
    message: 'Igris API is online',
  }
})

app.listen({ port: 3333 }).then(() => {
  console.log('🚀 [Igris API] HTTP Server running on http://localhost:3333')
})
