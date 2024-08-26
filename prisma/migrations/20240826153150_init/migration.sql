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
    `salesRepEmployeeNumber` INTEGER UNSIGNED NULL,
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
    `officeCode` VARCHAR(10) NULL,
    `reportsTo` INTEGER UNSIGNED NULL,
    `jobTitle` VARCHAR(50) NOT NULL,
    `role` VARCHAR(50) NULL DEFAULT 'Staff',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`employeeNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offices` (
    `officeCode` VARCHAR(10) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `addressLine1` VARCHAR(50) NOT NULL,
    `addressLine2` VARCHAR(50) NULL,
    `state` VARCHAR(50) NOT NULL,
    `country` VARCHAR(50) NOT NULL,
    `postalCode` VARCHAR(50) NOT NULL,
    `territory` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`officeCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `permissions` JSON NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `employeeNumber` INTEGER UNSIGNED NULL,
    `username` VARCHAR(20) NOT NULL,
    `password` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `i_employee_number`(`employeeNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `productCode` VARCHAR(15) NOT NULL,
    `productName` VARCHAR(70) NOT NULL,
    `productLine` VARCHAR(50) NOT NULL,
    `productScale` VARCHAR(10) NOT NULL,
    `productVendor` VARCHAR(50) NOT NULL,
    `productDescription` TEXT NOT NULL,
    `quantityInStock` INTEGER NOT NULL,
    `buyPrice` DECIMAL(10, 2) NOT NULL,
    `MSRP` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`productCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productlines` (
    `productLine` VARCHAR(15) NOT NULL,
    `textDescription` TEXT NOT NULL,
    `htmlDescription` TEXT NOT NULL,
    `image` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`productLine`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `orderNumber` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `orderDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `requiredDate` DATETIME(3) NOT NULL,
    `shippedDate` DATETIME(3) NULL,
    `status` VARCHAR(15) NOT NULL DEFAULT 'Pending',
    `comments` VARCHAR(191) NULL,
    `customerNumber` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`orderNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orderdetails` (
    `orderNumber` INTEGER UNSIGNED NOT NULL,
    `productCode` VARCHAR(15) NOT NULL,
    `quantityOrdered` INTEGER NOT NULL,
    `priceEach` DECIMAL(65, 30) NOT NULL,
    `orderLineNumber` INTEGER NOT NULL AUTO_INCREMENT,
    `productLineOfProduct` VARCHAR(15) NULL,

    UNIQUE INDEX `orderdetails_orderNumber_productCode_key`(`orderNumber`, `productCode`),
    PRIMARY KEY (`orderLineNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_salesRepEmployeeNumber_fkey` FOREIGN KEY (`salesRepEmployeeNumber`) REFERENCES `employees`(`employeeNumber`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_reportsTo_fkey` FOREIGN KEY (`reportsTo`) REFERENCES `employees`(`employeeNumber`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_role_fkey` FOREIGN KEY (`role`) REFERENCES `roles`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_officeCode_fkey` FOREIGN KEY (`officeCode`) REFERENCES `offices`(`officeCode`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_employeeNumber_fkey` FOREIGN KEY (`employeeNumber`) REFERENCES `employees`(`employeeNumber`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_productLine_fkey` FOREIGN KEY (`productLine`) REFERENCES `productlines`(`productLine`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_customerNumber_fkey` FOREIGN KEY (`customerNumber`) REFERENCES `customers`(`customerNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderdetails` ADD CONSTRAINT `orderdetails_orderNumber_fkey` FOREIGN KEY (`orderNumber`) REFERENCES `orders`(`orderNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderdetails` ADD CONSTRAINT `orderdetails_productCode_fkey` FOREIGN KEY (`productCode`) REFERENCES `products`(`productCode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderdetails` ADD CONSTRAINT `orderdetails_productLineOfProduct_fkey` FOREIGN KEY (`productLineOfProduct`) REFERENCES `productlines`(`productLine`) ON DELETE SET NULL ON UPDATE CASCADE;
