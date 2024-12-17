/*
  Warnings:

  - The primary key for the `Game` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Game` table. All the data in the column will be lost.
  - The primary key for the `Genre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Genre` table. All the data in the column will be lost.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gameId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Review` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,game_id]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - The required column `game_id` was added to the `Game` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `genre_id` was added to the `Genre` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `game_id` to the `Review` table without a default value. This is not possible if the table is not empty.
  - The required column `review_id` was added to the `Review` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `user_id` to the `Review` table without a default value. This is not possible if the table is not empty.
  - The required column `user_id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX `Review_userId_gameId_key` ON `Review`;

-- AlterTable
ALTER TABLE `Game` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `game_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`game_id`);

-- AlterTable
ALTER TABLE `Genre` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `genre_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`genre_id`);

-- AlterTable
ALTER TABLE `Review` DROP PRIMARY KEY,
    DROP COLUMN `gameId`,
    DROP COLUMN `id`,
    DROP COLUMN `userId`,
    ADD COLUMN `game_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `review_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`review_id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`user_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Review_user_id_game_id_key` ON `Review`(`user_id`, `game_id`);
