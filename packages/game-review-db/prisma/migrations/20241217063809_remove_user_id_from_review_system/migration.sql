/*
  Warnings:

  - You are about to drop the column `user_id` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[game_title,review_id]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Review_user_id_game_title_key` ON `Review`;

-- AlterTable
ALTER TABLE `Review` DROP COLUMN `user_id`;

-- CreateIndex
CREATE UNIQUE INDEX `Review_game_title_review_id_key` ON `Review`(`game_title`, `review_id`);
