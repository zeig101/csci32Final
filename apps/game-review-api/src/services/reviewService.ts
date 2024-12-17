import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
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

  async findManyReviews({ take = DEFAULT_TAKE, skip = DEFAULT_SKIP, orderBy, game_title }: FindManyReviewProps) {
    const reviews = await this.prisma.review.findMany({
      take,
      skip,
      where: {
        game_title: game_title || undefined,
      },
      include: {
        game: true,
      },
    })
    return reviews.map((review) => ({
      review_id: review.review_id,
      rating: review.rating,
      game_title: review.game_title,
    }))
  }

  async findOneReview({ review_id }: FindOneReviewProps) {
    try {
      return this.prisma.review.findUnique({
        where: { review_id: review_id },
        include: {
          game: true,
        },
      })
    } catch (error) {
      this.logger.error(`Error getting review ${review_id}`, error)
      throw new Error('Failed to get')
    }
  }

  async createOneReview({ rating, game_title }: CreateOneReviewProps) {
    try {
      console.log('Searching for game with title:', game_title)
      let game = await this.prisma.game.findUnique({
        where: { title: game_title },
      })

      if (!game) {
        console.log('No match found, creating entry for:', game_title)
        game = await this.prisma.game.create({
          data: {
            title: game_title,
          },
        })
        console.log('game made:', game)
      } else {
        console.log('game found:', game)
      }
      console.log('made game for', game.title)
      console.log('making review for', game.title)
      console.log('Review data to create:', { rating, game_title: game.title })
      const review = await this.prisma.review.create({
        data: {
          rating,
          game_title: game.title,
        },
      })
      console.log('Review created:', review)
      return review
    } catch (error) {
      this.logger.error(`Error creating review for "${game_title}":`, error)

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.error('Unique constraint')
        } else if (error.code === 'P2003') {
          console.error('Foreign key constraint')
        }
      }

      throw new Error(`Could not create review for "${game_title}"`)
    }
  }
}
