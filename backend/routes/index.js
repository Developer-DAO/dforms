module.exports = function (fastify, options, done) {
  fastify.register(require('./siwe.js'))
  done()
}
