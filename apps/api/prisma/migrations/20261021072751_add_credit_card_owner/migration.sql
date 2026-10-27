-- AlterTable
ALTER TABLE `card` ADD COLUMN `user_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `card` ADD CONSTRAINT `card_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
