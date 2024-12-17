import fp from 'fastify-plugin'
import fastifySwagger, { FastifyDynamicSwaggerOptions } from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export default fp<FastifyDynamicSwaggerOptions>(async (fastify) => {
  fastify.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'gameReviewAPI',
        description: 'API for making and searching game reviews',
        version: '0.1.0',
      },
      servers: [
        {
          url: 'http://127.0.0.1:7000',
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'apiKey',
            in: 'header',
          },
        },
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
    },
  })
  fastify.register(fastifySwaggerUi, { routePrefix: '/docs' })
})
