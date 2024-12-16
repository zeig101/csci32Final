import { Prisma, PrismaClient } from '@prisma/client'
import { FastifyBaseLogger } from 'fastify'

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export const DEFAULT_TAKE = 15
export const DEFAULT_SKIP = 0

interface ReviewServiceProps {
  logger: FastifyBaseLogger
  prisma: PrismaClient
}

interface FindOneReviewProps {}

interface FindManyReviewProps {}

interface CreateGenreProps {}

interface CreateOneReviewProps {}

interface GetReviewOrderByProps {}

export class ReviewService {
  logger: FastifyBaseLogger
  prisma: PrismaClient

  constructor({ logger, prisma }: ReviewServiceProps) {
    this.logger = logger
    this.prisma = prisma
  }

  getReviewOrderBy({}: GetReviewOrderByProps): Prisma.ReviewOrderByWithRelationInput {}

  async findOneReview({}: FindOneReviewProps) {}

  async CreateOneReview({}: CreateOneReviewProps) {}
}
