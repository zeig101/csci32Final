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

interface FindOneReviewProps {
  review_id: string
}

interface FindManyReviewProps {
  take?: number
  skip?: number
  orderBy?: Prisma.ReviewOrderByWithRelationInput
  userId?: string
  gameId?: string
}

interface CreateGenreProps {
  name: string
}

interface CreateOneReviewProps {
  title: string
  rating: number
  game_Id: string
  user_Id: string
  genreName: string
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
      throw new Error('Bad order field')
    }
    return {
      [field]: order,
    }
  }

  async findOneReview({ review_id }: FindOneReviewProps) {
    try {
      return this.prisma.review.findUnique({
        where: { review_id: review_id },
        include: {
          game: true,
          user: true,
        },
      })
    } catch (error) {
      this.logger.error(`Error fetching review ${review_id}`, error)
      throw new Error('Failed to fetch')
    }
  }

  async findManyReviews({ take = DEFAULT_TAKE, skip = DEFAULT_SKIP, orderBy, userId, gameId }: FindManyReviewProps) {
    const reviews = await this.prisma.review.findMany({
      take,
      skip,
      where: {
        user_id: userId,
        game_id: gameId,
      },
      include: {
        game: true,
        user: true,
      },
    })
    return reviews.map((review) => ({
      review_id: review.review_id,
      rating: review.rating,
      game_id: review.game_id,
      user_id: review.user_id,
    }))
  }

  async createOneReview({ title, rating, game_Id, user_Id, genreName }: CreateOneReviewProps) {
    try {
      let genre = await this.prisma.genre.findUnique({
        where: { name: genreName.toLowerCase() },
      })

      if (!genre) {
        genre = await this.prisma.genre.create({
          data: { name: genreName.toLowerCase() },
        })
      }

      let game = await this.prisma.game.findUnique({
        where: { game_id: game_Id },
      })

      if (!game) {
        game = await this.prisma.game.create({
          data: {
            title: title.toLowerCase(),
            genres: {
              connect: { genre_id: genre.genre_id },
            },
          },
        })
      }

      return this.prisma.review.create({
        data: {
          rating,
          game_id: game.game_id,
          user_id: user_Id,
        },
      })
    } catch (error) {
      this.logger.error('Error creating review:', error)
      throw new Error('Failed to create review')
    }
  }

  async createGenre({ name }: CreateGenreProps) {
    return this.prisma.genre.create({
      data: { name },
    })
  }
}
