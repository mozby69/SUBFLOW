/*
  Warnings:

  - Added the required column `creditCardId` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subscription` ADD COLUMN `creditCardId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `card` (
    `card_id` INTEGER NOT NULL AUTO_INCREMENT,
    `bank` VARCHAR(100) NOT NULL,
    `last_four_digit` VARCHAR(100) NOT NULL,
    `network` VARCHAR(100) NOT NULL,
    `nickname` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`card_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `subscription` ADD CONSTRAINT `subscription_creditCardId_fkey` FOREIGN KEY (`creditCardId`) REFERENCES `card`(`card_id`) ON DELETE CASCADE ON UPDATE CASCADE;
