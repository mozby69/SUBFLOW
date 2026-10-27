/*
  Warnings:

  - A unique constraint covering the columns `[deduplicationKey]` on the table `notifications` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `deduplicationKey` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `notification_preferences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `subscriptionReminder` BOOLEAN NOT NULL DEFAULT true,
    `billingReminder` BOOLEAN NOT NULL DEFAULT true,
    `overdueAlert` BOOLEAN NOT NULL DEFAULT true,
    `cardReminder` BOOLEAN NOT NULL DEFAULT true,
    `paymentConfirmation` BOOLEAN NOT NULL DEFAULT true,
    `reminderDays` INTEGER NOT NULL DEFAULT 3,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `notification_preferences_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `notifications_deduplicationKey_key` ON `notifications`(`deduplicationKey`);

-- AddForeignKey
ALTER TABLE `notification_preferences` ADD CONSTRAINT `notification_preferences_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
