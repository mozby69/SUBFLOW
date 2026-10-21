-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(255) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_role_name_key`(`role_name`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_roles` (
    `user_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,
    `assigned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_roles_role_id_idx`(`role_id`),
    PRIMARY KEY (`user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `permission_id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `permissions_code_key`(`code`),
    UNIQUE INDEX `permissions_name_key`(`name`),
    PRIMARY KEY (`permission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permissions` (
    `roleId` INTEGER NOT NULL,
    `permissionId` INTEGER NOT NULL,

    PRIMARY KEY (`roleId`, `permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `color` VARCHAR(20) NULL,
    `icon` VARCHAR(100) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `subscription_categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription` (
    `subscription_id` INTEGER NOT NULL AUTO_INCREMENT,
    `subscription_name` VARCHAR(100) NOT NULL,
    `amount` DECIMAL(10, 2) NULL,
    `billing_cycle` ENUM('MONTHLY', 'YEARLY') NOT NULL,
    `next_billing` DATE NULL,
    `payment_card` VARCHAR(100) NULL,
    `category` VARCHAR(100) NULL,
    `status` ENUM('ACTIVE', 'PAUSED', 'CANCELLED', 'TRIAL') NOT NULL,
    `credit_card` INTEGER NOT NULL,
    `description` TEXT NULL,
    `currencyCode` VARCHAR(3) NOT NULL DEFAULT 'PHP',
    `startDate` DATE NULL,
    `endDate` DATE NULL,
    `anchorDay` INTEGER NULL,
    `autoRenew` BOOLEAN NOT NULL DEFAULT true,
    `website` VARCHAR(255) NULL,
    `categoryId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `subscription_status_next_billing_idx`(`status`, `next_billing`),
    INDEX `subscription_credit_card_idx`(`credit_card`),
    INDEX `subscription_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`subscription_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_billings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subscriptionId` INTEGER NOT NULL,
    `dueDate` DATE NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL DEFAULT 'PHP',
    `status` ENUM('SCHEDULED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `paidAmount` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `remarks` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `subscription_billings_dueDate_status_idx`(`dueDate`, `status`),
    UNIQUE INDEX `subscription_billings_subscriptionId_dueDate_key`(`subscriptionId`, `dueDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subscriptionId` INTEGER NOT NULL,
    `billingId` INTEGER NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL DEFAULT 'PHP',
    `paymentDate` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `referenceNumber` VARCHAR(100) NULL,
    `idempotencyKey` VARCHAR(100) NULL,
    `remarks` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `subscription_payments_idempotencyKey_key`(`idempotencyKey`),
    INDEX `subscription_payments_subscriptionId_idx`(`subscriptionId`),
    INDEX `subscription_payments_billingId_idx`(`billingId`),
    INDEX `subscription_payments_status_paymentDate_idx`(`status`, `paymentDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `card_charges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creditCardId` INTEGER NOT NULL,
    `subscriptionPaymentId` INTEGER NOT NULL,
    `statementId` INTEGER NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL,
    `postedAmount` DECIMAL(15, 2) NOT NULL,
    `exchangeRate` DECIMAL(20, 8) NOT NULL DEFAULT 1,
    `transactionDate` DATE NOT NULL,
    `postingDate` DATE NULL,
    `description` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `card_charges_subscriptionPaymentId_key`(`subscriptionPaymentId`),
    INDEX `card_charges_creditCardId_transactionDate_idx`(`creditCardId`, `transactionDate`),
    INDEX `card_charges_statementId_idx`(`statementId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `card_statements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creditCardId` INTEGER NOT NULL,
    `periodStart` DATE NOT NULL,
    `periodEnd` DATE NOT NULL,
    `statementDate` DATE NOT NULL,
    `dueDate` DATE NOT NULL,
    `openingBalance` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `totalCharges` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `totalPayments` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `closingBalance` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `minimumPayment` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `currencyCode` VARCHAR(3) NOT NULL DEFAULT 'PHP',
    `status` ENUM('OPEN', 'CLOSED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE') NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `card_statements_dueDate_status_idx`(`dueDate`, `status`),
    UNIQUE INDEX `card_statements_creditCardId_periodStart_periodEnd_key`(`creditCardId`, `periodStart`, `periodEnd`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `card_payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creditCardId` INTEGER NOT NULL,
    `statementId` INTEGER NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL DEFAULT 'PHP',
    `paymentDate` DATE NOT NULL,
    `referenceNumber` VARCHAR(100) NULL,
    `remarks` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `card_payments_creditCardId_paymentDate_idx`(`creditCardId`, `paymentDate`),
    INDEX `card_payments_statementId_idx`(`statementId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_price_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subscriptionId` INTEGER NOT NULL,
    `oldAmount` DECIMAL(15, 2) NULL,
    `newAmount` DECIMAL(15, 2) NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL DEFAULT 'PHP',
    `effectiveDate` DATE NOT NULL,
    `reason` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `subscription_price_history_subscriptionId_effectiveDate_idx`(`subscriptionId`, `effectiveDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `budgets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `currencyCode` VARCHAR(3) NOT NULL DEFAULT 'PHP',
    `period` ENUM('MONTHLY', 'YEARLY') NOT NULL DEFAULT 'MONTHLY',
    `categoryId` INTEGER NULL,
    `alertThreshold` INTEGER NOT NULL DEFAULT 80,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `startDate` DATE NOT NULL,
    `endDate` DATE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `budgets_period_isActive_idx`(`period`, `isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `subscriptionId` INTEGER NULL,
    `type` ENUM('BILLING_REMINDER', 'PAYMENT_DUE', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'BUDGET_WARNING', 'SUBSCRIPTION_EXPIRING', 'CARD_STATEMENT', 'SYSTEM') NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `scheduledFor` DATETIME(3) NULL,
    `sentAt` DATETIME(3) NULL,
    `readAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_userId_isRead_idx`(`userId`, `isRead`),
    INDEX `notifications_scheduledFor_idx`(`scheduledFor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exchange_rates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fromCurrency` VARCHAR(3) NOT NULL,
    `toCurrency` VARCHAR(3) NOT NULL,
    `rate` DECIMAL(20, 8) NOT NULL,
    `effectiveDate` DATE NOT NULL,
    `source` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `exchange_rates_effectiveDate_idx`(`effectiveDate`),
    UNIQUE INDEX `exchange_rates_fromCurrency_toCurrency_effectiveDate_key`(`fromCurrency`, `toCurrency`, `effectiveDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'PAYMENT', 'CANCEL', 'GENERATE') NOT NULL,
    `module` VARCHAR(100) NOT NULL,
    `referenceId` INTEGER NULL,
    `description` TEXT NULL,
    `oldValues` JSON NULL,
    `newValues` JSON NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_module_referenceId_idx`(`module`, `referenceId`),
    INDEX `audit_logs_userId_idx`(`userId`),
    INDEX `audit_logs_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `card` (
    `card_id` INTEGER NOT NULL AUTO_INCREMENT,
    `bank` VARCHAR(100) NOT NULL,
    `last_four_digit` INTEGER NOT NULL,
    `network` VARCHAR(100) NOT NULL,
    `nickname` VARCHAR(100) NULL,
    `creditLimit` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `currencyCode` VARCHAR(3) NOT NULL DEFAULT 'PHP',
    `statementDay` INTEGER NULL,
    `dueDay` INTEGER NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'BLOCKED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    `expiryMonth` INTEGER NULL,
    `expiryYear` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`card_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permissions`(`permission_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription` ADD CONSTRAINT `subscription_credit_card_fkey` FOREIGN KEY (`credit_card`) REFERENCES `card`(`card_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription` ADD CONSTRAINT `subscription_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `subscription_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_billings` ADD CONSTRAINT `subscription_billings_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `subscription`(`subscription_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_payments` ADD CONSTRAINT `subscription_payments_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `subscription`(`subscription_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_payments` ADD CONSTRAINT `subscription_payments_billingId_fkey` FOREIGN KEY (`billingId`) REFERENCES `subscription_billings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `card_charges` ADD CONSTRAINT `card_charges_creditCardId_fkey` FOREIGN KEY (`creditCardId`) REFERENCES `card`(`card_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `card_charges` ADD CONSTRAINT `card_charges_subscriptionPaymentId_fkey` FOREIGN KEY (`subscriptionPaymentId`) REFERENCES `subscription_payments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `card_charges` ADD CONSTRAINT `card_charges_statementId_fkey` FOREIGN KEY (`statementId`) REFERENCES `card_statements`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `card_statements` ADD CONSTRAINT `card_statements_creditCardId_fkey` FOREIGN KEY (`creditCardId`) REFERENCES `card`(`card_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `card_payments` ADD CONSTRAINT `card_payments_creditCardId_fkey` FOREIGN KEY (`creditCardId`) REFERENCES `card`(`card_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `card_payments` ADD CONSTRAINT `card_payments_statementId_fkey` FOREIGN KEY (`statementId`) REFERENCES `card_statements`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_price_history` ADD CONSTRAINT `subscription_price_history_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `subscription`(`subscription_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `budgets` ADD CONSTRAINT `budgets_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `subscription_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `subscription`(`subscription_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
