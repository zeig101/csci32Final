import fp from 'fastify-plugin'
import sensible, { SensibleOptions } from '@fastify/sensible' //Module '"@fastify/sensible"' has no exported member 'SensibleOptions'. whyyyyyyyyyyyyy

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<SensibleOptions>(async (fastify) => {
  fastify.register(sensible)
})
