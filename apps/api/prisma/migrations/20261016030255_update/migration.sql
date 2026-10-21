/*
  Warnings:

  - The values [DUE_SOON,OVERDUE] on the enum `subscription_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `subscription` MODIFY `status` ENUM('ACTIVE', 'PAUSED', 'CANCELLED', 'TRIAL') NOT NULL;
