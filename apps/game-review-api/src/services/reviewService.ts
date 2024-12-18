import { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { FastifyBaseLogger } from 'fastify'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

console.log('DATABASE_URL:', process.env.DATABASE_URL)

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

interface FindOneReviewProps {
  review_id: string
}

interface FindManyReviewProps {
  take?: number
  skip?: number
  orderBy?: Prisma.ReviewOrderByWithRelationInput
  game_title: string
}

interface CreateOneReviewProps {
  rating: number
  game_title: string
}

interface GetReviewOrderByProps {
  field: keyof Prisma.ReviewOrderByWithRelationInput
  order: SortOrder
}

export class ReviewService {
  logger: FastifyBaseLogger
  prisma: PrismaClient

  constructor({ logger, prisma }: ReviewServiceProps) {
    this.logger = logger
    this.prisma = prisma
  }

  getReviewOrderBy({ field, order }: GetReviewOrderByProps): Prisma.ReviewOrderByWithRelationInput {
    if (!field) {
      throw new Error('Bad order')
    }
    return {
      [field]: order,
    }
  }

  async findManyReviews(props: FindManyReviewProps) {
    this.logger.info({ props }, 'findManyReviews')
    const { game_title, take, skip } = props
    return this.prisma.review.findMany({
      take,
      skip,
      where: {
        game_title,
      },
      select: {
        review_id: true,
        rating: true,
        game_title: true,
      },
    })
  }

  async findOneReview(props: FindOneReviewProps) {
    this.logger.info({ props }, 'findOneReview')
    const { review_id } = props
    try {
      return this.prisma.review.findUnique({
        where: { review_id},
        select: {
          review_id: true,
          rating: true,
          game_title: true
        },
      })
    } catch (error) {
      this.logger.error(`Error getting review ${review_id}`, error)
      throw new Error('Failed to get')
    }
  }

  async createOneReview(props: CreateOneReviewProps) {
    this.logger.info({ props }, 'createOneReview')
    const { rating, game_title } = props
    const review = await this.prisma.review.create({
      data: {
        rating,
        game_title,
      },
    })
    return review
  }
}//I am the worlds biggest idiot. I did so much work and debugging and signal checking>
//I was missing the .env for the api folder.
//That was it.
