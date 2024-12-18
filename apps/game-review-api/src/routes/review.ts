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
    async function (request: any, reply) {
      return fastify.reviewService.findManyReviews({
          take: request.query.take,
          skip: request.query.skip,
          game_title: request.query.game_title,
          review_id: request.query.review_id,
          rating: request.query.rating,
        }
      )
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
    async function (request: any, reply) {
      return fastify.reviewService.findOneReview({
        review_id: request.params.id
      })
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
    async function (request, reply) {
      return fastify.reviewService.createOneReview({
        rating: request.body.rating,
        game_title: request.body.game_title,
      })
    },
  )
}

export default review
