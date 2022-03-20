module.exports = function (fastify, options, done) {
  fastify.register(require('fastify-cors'), {
    origin: '*'
  })
  fastify.register(require('./info.js'))
  fastify.register(require('./siwe.js'))
  done()
}
