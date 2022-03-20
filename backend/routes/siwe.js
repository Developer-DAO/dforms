const { generateNonce, SiweMessage } = require('siwe')

module.exports = async function (fastify, options, done) {
  fastify.get('/nonce', async function (request, reply) {
    request.session.nonce = await generateNonce()
    reply.send({ nonce: request.session.nonce })
  })

  fastify.post('/verify', async function (request, reply) {
    const { message, signature } = request.body
    const siweMessage = new SiweMessage(message)
    try {
      const fields = await siweMessage.validate(signature)
      if (fields.nonce !== request.session.nonce) {
        reply.code(403).send({ error: 'Invalid nonce' })
        return
      }
      request.session.siwe = fields
      reply.send()
      return
    } catch {
      reply.code(403).send({ error: 'Invalid signature' })
    }
  })

  done()
}
