/*
  Warnings:

  - Added the required column `destination` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `location` ADD COLUMN `destination` VARCHAR(191) NOT NULL,
    ADD COLUMN `origin` VARCHAR(191) NOT NULL;
