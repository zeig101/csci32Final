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
      schema: {
        tags: ['Endpoint: Get all reviews'],
        description: 'Endpoint to get all reviews',
        response: {
          200: Type.Array(ReviewType),
          404: ReviewNotFoundType,
        },
      },
    },
    async function (request any, reply) {
      return fastify.reviewService.findManyReviews({
        
      })
        })
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
    async function (request: any, reply) {
      try {
        const review = await this.prisma.review.findUnique({
          where: { id: request.params.id },
        })
        if (!review) {
          return reply.status(404).send({
            statusCode: 404,
            message: 'Reviews not found',
            error: 'Not Found',
          })
        }
        return review
      } catch (error) {
        console.error('Error getting review:', error)
        return reply.status(500).send({
          statusCode: 404,
          message: 'Reviews not found',
          error: 'Not Found',
        })
      }
    },
  )

  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/reviews',
    {
      schema: {
        tags: ['Endpoint: Create a review'],
        description: 'Endpoint to create a review',
        body: CreateReviewTypeboxType,
        response: {
          200: Type.Object({ review_id: Type.String() }),
          400: Type.Object({ message: Type.String() }),
        },
      },
    },
    async function (request, reply) {
      const { rating, gameId } = request.body as { rating: number; gameId: string }
      try {
        const game = await this.prisma.game.findUnique({
          where: { id: gameId },
        })
        if (!game) {
          return reply.status(404).send({ message: 'Game not found' })
        }
        const review = await this.prisma.review.create({
          data: {
            rating,
            gameId,
            userId: 'example-Id',
          },
        })
        return reply.status(201).send({ review_id: review.id })
      } catch (error) {
        console.error('Error creating review:', error)
        return reply.status(500).send({ message: 'Failed to create review' })
      }
    },
  )
}

export default review
