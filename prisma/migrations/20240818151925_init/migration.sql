-- CreateTable
CREATE TABLE `customers` (
    `customerNumber` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `customerName` VARCHAR(255) NOT NULL,
    `contactLastName` VARCHAR(50) NOT NULL,
    `contactFirstName` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `addressLine1` VARCHAR(50) NOT NULL,
    `addressLine2` VARCHAR(50) NULL,
    `city` VARCHAR(50) NOT NULL,
    `state` VARCHAR(50) NULL,
    `postalCode` VARCHAR(50) NULL,
    `country` VARCHAR(50) NOT NULL,
    `salesRepEmployeeNumber` INTEGER UNSIGNED NOT NULL,
    `creditLimit` DECIMAL(10, 2) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`customerNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `employeeNumber` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `lastName` VARCHAR(50) NOT NULL,
    `firstName` VARCHAR(50) NOT NULL,
    `extension` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `officeCode` VARCHAR(10) NOT NULL,
    `reportsTo` INTEGER UNSIGNED NULL,
    `jobTitle` VARCHAR(50) NOT NULL,
    `role` VARCHAR(50) NULL DEFAULT 'Staff',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`employeeNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `permissions` JSON NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    INDEX `i_name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `employeeNumber` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(20) NOT NULL,
    `password` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    INDEX `i_employee_number`(`employeeNumber`),
    INDEX `i_username`(`username`),
    PRIMARY KEY (`employeeNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_salesRepEmployeeNumber_fkey` FOREIGN KEY (`salesRepEmployeeNumber`) REFERENCES `employees`(`employeeNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_role_fkey` FOREIGN KEY (`role`) REFERENCES `roles`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_employeeNumber_fkey` FOREIGN KEY (`employeeNumber`) REFERENCES `employees`(`employeeNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;
