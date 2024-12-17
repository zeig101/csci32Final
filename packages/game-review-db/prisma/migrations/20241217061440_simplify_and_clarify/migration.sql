/*
  Warnings:

  - The primary key for the `Game` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `game_id` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `game_id` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GameToGenre` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,game_title]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `game_title` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Review_game_id_idx` ON `Review`;

-- DropIndex
DROP INDEX `Review_user_id_game_id_key` ON `Review`;

-- AlterTable
ALTER TABLE `Game` DROP PRIMARY KEY,
    DROP COLUMN `game_id`;

-- AlterTable
ALTER TABLE `Review` DROP COLUMN `game_id`,
    ADD COLUMN `game_title` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Genre`;

-- DropTable
DROP TABLE `_GameToGenre`;

-- CreateIndex
CREATE INDEX `Review_game_title_idx` ON `Review`(`game_title`);

-- CreateIndex
CREATE UNIQUE INDEX `Review_user_id_game_title_key` ON `Review`(`user_id`, `game_title`);
