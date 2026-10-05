-- CreateTable
SET default_storage_engine = InnoDB;

CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `avatar_url` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_sessions_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `groups` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `type` ENUM('FLAT', 'HOSTEL', 'FAMILY', 'TRIP', 'OTHER') NOT NULL DEFAULT 'FLAT',
    `currency` CHAR(3) NOT NULL DEFAULT 'PKR',
    `created_by` CHAR(36) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group_members` (
    `id` CHAR(36) NOT NULL,
    `group_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `role` ENUM('OWNER', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `left_at` DATETIME(3) NULL,

    UNIQUE INDEX `uq_group_user`(`group_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitations` (
    `id` CHAR(36) NOT NULL,
    `group_id` CHAR(36) NOT NULL,
    `token_hash` CHAR(64) NOT NULL,
    `created_by` CHAR(36) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `revoked_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `invitations_token_hash_key`(`token_hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expenses` (
    `id` CHAR(36) NOT NULL,
    `group_id` CHAR(36) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `amount` BIGINT UNSIGNED NOT NULL,
    `paid_by` CHAR(36) NOT NULL,
    `category` ENUM('GROCERY', 'RENT', 'UTILITIES', 'INTERNET', 'FOOD', 'TRANSPORT', 'HOUSEHOLD', 'ENTERTAINMENT', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `split_method` ENUM('EQUAL', 'CUSTOM') NOT NULL,
    `expense_date` DATE NOT NULL,
    `note` VARCHAR(500) NULL,
    `receipt_url` VARCHAR(500) NULL,
    `created_by` CHAR(36) NOT NULL,
    `idempotency_key` VARCHAR(64) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    INDEX `idx_expenses_group_date`(`group_id`, `expense_date`),
    UNIQUE INDEX `uq_expense_idem`(`group_id`, `created_by`, `idempotency_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expense_shares` (
    `id` CHAR(36) NOT NULL,
    `expense_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `share_amount` BIGINT UNSIGNED NOT NULL,

    UNIQUE INDEX `uq_expense_user`(`expense_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settlements` (
    `id` CHAR(36) NOT NULL,
    `group_id` CHAR(36) NOT NULL,
    `from_user_id` CHAR(36) NOT NULL,
    `to_user_id` CHAR(36) NOT NULL,
    `amount` BIGINT UNSIGNED NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `note` VARCHAR(300) NULL,
    `idempotency_key` VARCHAR(64) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `responded_at` DATETIME(3) NULL,

    INDEX `idx_settle_group_status`(`group_id`, `status`),
    UNIQUE INDEX `uq_settle_idem`(`group_id`, `from_user_id`, `idempotency_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_logs` (
    `id` CHAR(36) NOT NULL,
    `group_id` CHAR(36) NOT NULL,
    `actor_id` CHAR(36) NOT NULL,
    `action` VARCHAR(50) NOT NULL,
    `entity_type` VARCHAR(30) NOT NULL,
    `entity_id` CHAR(36) NULL,
    `meta` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_activity_group_time`(`group_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `groups` ADD CONSTRAINT `groups_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group_members` ADD CONSTRAINT `group_members_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group_members` ADD CONSTRAINT `group_members_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_paid_by_fkey` FOREIGN KEY (`paid_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expense_shares` ADD CONSTRAINT `expense_shares_expense_id_fkey` FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expense_shares` ADD CONSTRAINT `expense_shares_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlements` ADD CONSTRAINT `settlements_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlements` ADD CONSTRAINT `settlements_from_user_id_fkey` FOREIGN KEY (`from_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `settlements` ADD CONSTRAINT `settlements_to_user_id_fkey` FOREIGN KEY (`to_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_actor_id_fkey` FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Domain constraints complement application validation.
ALTER TABLE `expenses` ADD CONSTRAINT `chk_expense_amount` CHECK (`amount` > 0);
ALTER TABLE `settlements` ADD CONSTRAINT `chk_settle_amount` CHECK (`amount` > 0);
ALTER TABLE `settlements` ADD CONSTRAINT `chk_settle_diff` CHECK (`from_user_id` <> `to_user_id`);
