/*
  Warnings:

  - You are about to drop the column `billing_cycle` on the `subscription` table. All the data in the column will be lost.
  - Added the required column `billingCycle` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subscription` DROP COLUMN `billing_cycle`,
    ADD COLUMN `billingCycle` ENUM('MONTHLY', 'YEARLY') NOT NULL;
