-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ownerName` VARCHAR(191) NOT NULL,
    `lat1` VARCHAR(191) NOT NULL,
    `lon1` VARCHAR(191) NOT NULL,
    `lat2` VARCHAR(191) NOT NULL,
    `lon2` VARCHAR(191) NOT NULL,
    `distance` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Location` ADD CONSTRAINT `Location_ownerName_fkey` FOREIGN KEY (`ownerName`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
