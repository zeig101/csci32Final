import fp from 'fastify-plugin'
import { ReviewService } from '../services/ReviewService.js'
import { FP_PRISMA } from './prisma.js'

export const FP_REVIEW_SERVICE = 'reviewService'

declare module 'fastify' {
  export interface FastifyInstance {
    reviewService: ReviewService
  }
}

export default fp(async (fastify) => {
  const ReviewServiceInstance = new ReviewService({
    logger: fastify.log,
    prisma: fastify[FP_PRISMA],
  })
  fastify.decorate(FP_REVIEW_SERVICE, ReviewServiceInstance, [FP_PRISMA])
})
