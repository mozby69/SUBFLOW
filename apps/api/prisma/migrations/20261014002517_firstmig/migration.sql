-- CreateTable
CREATE TABLE `subscription` (
    `subscription_id` INTEGER NOT NULL AUTO_INCREMENT,
    `subscription_name` VARCHAR(100) NOT NULL,
    `amount` DECIMAL(10, 2) NULL,
    `billing_cycle` VARCHAR(50) NOT NULL,
    `next_billing` DATE NULL,
    `payment_card` VARCHAR(100) NULL,
    `category` VARCHAR(100) NULL,
    `status` ENUM('ACTIVE', 'DUE_SOON', 'OVERDUE', 'CANCELLED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`subscription_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
