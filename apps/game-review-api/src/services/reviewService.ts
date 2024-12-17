import { Prisma, PrismaClient } from '@prisma/client'
import { error } from 'console'
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
  id: string
}

interface FindManyReviewProps {
  take?: number
  skip?: number
  orderBy?: Prisma.ReviewOrderByWithRelationInput
}

interface CreateGenreProps {
  name: string
}

interface CreateOneReviewProps {
  title: string
  rating: number
  gameId?: string
  userId: string
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

  async findOneReview({ id }: FindOneReviewProps) {
    try {
      return this.prisma.review.findUnique({
        where: { id },
      })
    } catch (error) {
      this.logger.error(`Error fetching review ${id}`, error)
      throw new Error('Failed to fetch')
    }
  }

  async CreateOneReview({ title, rating, gameId, userId, genreName }: CreateOneReviewProps & { genreName: string }) {
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
        where: { title: title.toLowerCase() },
      })

      if (!game) {
        game = await this.prisma.game.create({
          data: {
            title: title.toLowerCase(),
            genres: {
              connect: { id: genre.id },
            },
          },
        })
      }

      return this.prisma.review.create({
        data: {
          title,
          rating,
          gameId: game.id,
          userId,
        },
      })
    } catch (error) {
      this.logger.error('Error creating review:', error)
      throw new Error('Failed to create review')
    }
  }

  async findManyReviews({ take = DEFAULT_TAKE, skip = DEFAULT_SKIP, orderBy }: FindManyReviewProps) {
    return this.prisma.review.findMany({
      take,
      skip,
      orderBy,
    })
  }

  async createGenre({ name }: CreateGenreProps) {
    return this.prisma.genre.create({
      data: { name },
    })
  }
}
