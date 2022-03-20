module.exports = async function (fastify, options, done) {
  fastify.head('/', async function (request, reply) {
    reply.send()
  })

  fastify.get('/', async function (request, reply) {
    reply.send({ message: "DForms API" })
  })

  done()
}
