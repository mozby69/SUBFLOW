/*
  Warnings:

  - You are about to alter the column `last_four_digit` on the `card` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Int`.
  - You are about to drop the column `billingCycle` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `creditCardId` on the `subscription` table. All the data in the column will be lost.
  - Added the required column `billing_cycle` to the `subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credit_card` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `subscription` DROP FOREIGN KEY `subscription_creditCardId_fkey`;

-- DropIndex
DROP INDEX `subscription_creditCardId_fkey` ON `subscription`;

-- AlterTable
ALTER TABLE `card` MODIFY `last_four_digit` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `subscription` DROP COLUMN `billingCycle`,
    DROP COLUMN `creditCardId`,
    ADD COLUMN `billing_cycle` ENUM('MONTHLY', 'YEARLY') NOT NULL,
    ADD COLUMN `credit_card` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `subscription` ADD CONSTRAINT `subscription_credit_card_fkey` FOREIGN KEY (`credit_card`) REFERENCES `card`(`card_id`) ON DELETE CASCADE ON UPDATE CASCADE;
