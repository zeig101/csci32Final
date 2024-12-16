import { prisma } from './client'

import type { User } from '@prisma/client'

const DEFAULT_USERS: Array<Partial<User>> = [
  {
    id: '12321',
    name: 'Game Reviewer',
  },
]

;(async () => {
  try {
    await Promise.all(
      DEFAULT_USERS.map((user) =>
        prisma.user.upsert({
          where: { id: user.id! },
          update: { ...user },
          create: { ...user },
        }),
      ),
    )
    console.log('Seeding successful!')
  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
