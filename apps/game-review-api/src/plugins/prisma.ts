import fp from 'fastify-plugin'
import { Prisma, PrismaClient } from '@prisma/client'

export const FP_PRISMA = 'prisma'

declare module 'fastify' {
  export interface FastifyInstance {
    prisma: PrismaClient
  }
}

export default fp(async (fastify) => {
  const prisma = new PrismaClient()
  fastify.decorate(FP_PRISMA, prisma)
})
