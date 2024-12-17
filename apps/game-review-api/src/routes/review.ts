import Fastify, { FastifyPluginAsync } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'

export const CreateReviewTypeboxType = Type.Object({
  rating: Type.Integer(),
  gameId: Type.String(),
})

export const ReviewType = Type.Object({
  id: Type.String(),
  rating: Type.Integer(),
  gameId: Type.String(),
  date: Type.String(),
  userId: Type.String(),
})

export const ReviewNotFoundType = Type.Object({
  statusCode: Type.Literal(404),
  message: Type.String(),
  error: Type.Literal('Not Found'),
})

const review: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/reviews',
    {
      schema:{
        tags: ['Endpoint: Get all reviews'],
        description: 'Endpoint to get all reviews',
        response: {
          200: Type.Array(ReviewType),
          404: ReviewNotFoundType,
        },
      },
    },
    async function (request, reply) {
      try {
        const reviews = await this.prisma.review.findMany({
          include: {
            game: true,
          },
        })
        return reviews
      } catch (error) {
        console.error('Error getting reviews:', error)
        return reply.status(500).send({ message: 'error getting reviews '})
      }
    },
  )

fastify.withTypeProvider<TypeBoxTypeProvider>().get(
  '/reviews/:id',
  {
    schema: {
      tags: ['Endpoint: get one review'],
      description: 'Endpoint to get one review',
      response: {
        200: ReviewType,
        404: ReviewNotFoundType,
      },
    },
  },

  async function (request, reply) {
    try{
      const review = await this.prisma.review.findUnique({})
    }
  }

)

}
