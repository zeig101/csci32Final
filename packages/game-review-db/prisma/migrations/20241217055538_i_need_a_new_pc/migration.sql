/*
  Warnings:

  - You are about to drop the column `entryDate` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Game` DROP COLUMN `entryDate`,
    DROP COLUMN `releaseDate`;

-- AlterTable
ALTER TABLE `Review` DROP COLUMN `date`;

-- CreateIndex
CREATE INDEX `Review_game_id_idx` ON `Review`(`game_id`);
