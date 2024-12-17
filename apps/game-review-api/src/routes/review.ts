import { FastifyPluginAsync } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'

export const CreateReviewTypeboxType = Type.Object({
  rating: Type.Integer(),
  game_title: Type.String(),
})

export const ReviewType = Type.Object({
  review_id: Type.String(),
  rating: Type.Integer(),
  game_title: Type.String(),
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
    async (request: any, reply) => {
      try {
        const reviews = await fastify.reviewService.findManyReviews({
          take: request.query.take,
          skip: request.query.skip,
          game_title: request.query.game_title,
        })

        if (!reviews || reviews.length === 0) {
          return reply.status(404).send({
            statusCode: 404,
            message: 'Reviews not found',
            error: 'Not Found',
          })
        }

        return reply.status(200).send(reviews)
      } catch (error) {
        console.error('Error getting reviews:', error)
        return reply.status(404).send({
          statusCode: 404,
          message: 'Reviews not found',
          error: 'Not Found',
        })
      }
    },
  )

  fastify.withTypeProvider<TypeBoxTypeProvider>().get(
    '/reviews/:id',
    {
      schema: {
        tags: ['Endpoint: Get one review'],
        description: 'Endpoint to get one review by review_id',
        response: {
          200: ReviewType,
          404: ReviewNotFoundType,
        },
      },
    },
    async (request: any, reply) => {
      try {
        const review = await fastify.reviewService.findOneReview({
          review_id: request.params.id,
        })

        if (!review) {
          return reply.status(404).send({
            statusCode: 404,
            message: 'Review not found',
            error: 'Not Found',
          })
        }

        return reply.status(200).send(review)
      } catch (error) {
        console.error('Error getting review:', error)
        return reply.status(404).send({
          statusCode: 404,
          message: 'not actual 404, unknown error',
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
        description: 'Endpoint to create a new review',
        body: CreateReviewTypeboxType,
        response: {
          200: Type.Object({ review_id: Type.String() }),
          404: ReviewNotFoundType,
        },
      },
    },
    async (request: any, reply) => {
      const { rating, game_title } = request.body as { rating: number; game_title: string }
      try {
        const review = await fastify.reviewService.createOneReview({
          rating,
          game_title,
        })

        return reply.status(200).send({ review_id: review.review_id })
      } catch (error) {
        console.error('Error creating review:', error)
        return reply.status(404).send({
          message: 'Failed to create review',
          error: 'Not Found',
          statusCode: 404,
        })
      }
    },
  )
}

export default review
