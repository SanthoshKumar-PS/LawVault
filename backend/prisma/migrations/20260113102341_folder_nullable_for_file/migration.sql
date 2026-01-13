-- DropForeignKey
ALTER TABLE `File` DROP FOREIGN KEY `File_folderId_fkey`;

-- DropIndex
DROP INDEX `File_folderId_fkey` ON `File`;

-- AlterTable
ALTER TABLE `File` MODIFY `folderId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
