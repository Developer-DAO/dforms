require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const fastifySession = require('@fastify/session')
const fastifyCookie = require('fastify-cookie')

fastify.register(fastifyCookie)
fastify.register(fastifySession, { secret: process.env.SECRET })
fastify.register(require('./routes'))

const start = async () => {
  try {
    await fastify.listen(process.env.PORT ?? 3000, process.env.HOST ?? '127.0.0.1')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
