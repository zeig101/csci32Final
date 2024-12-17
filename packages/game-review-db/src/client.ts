import { Prisma, PrismaClient } from '@prisma/client'

export const prisma = global.prisma || new PrismaClient() //Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature. on .prisma

if (process.env.NODE_ENV !== 'production') global.prisma = prisma //Element implicitly has an 'any' type because type 'typeof globalThis' has no index signature. on .prisma

export * from '@prisma/client'
