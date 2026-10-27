-- AlterTable
ALTER TABLE `subscription_categories` MODIFY `name` VARCHAR(100) NULL,
    MODIFY `isActive` BOOLEAN NULL DEFAULT true;
