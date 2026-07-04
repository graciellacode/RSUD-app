-- CreateTable
CREATE TABLE `dokter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `spesialisasi` VARCHAR(191) NOT NULL,
    `noIzinPraktek` VARCHAR(191) NOT NULL,
    `noHp` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `dokter_noIzinPraktek_key`(`noIzinPraktek`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwal_praktek` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dokterId` INTEGER NOT NULL,
    `hari` VARCHAR(191) NOT NULL,
    `jamMulai` VARCHAR(191) NOT NULL,
    `jamSelesai` VARCHAR(191) NOT NULL,
    `kuota` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pendaftaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pasienId` INTEGER NOT NULL,
    `jadwalPraktekId` INTEGER NOT NULL,
    `tanggalPeriksa` DATETIME(3) NOT NULL,
    `noAntrean` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `keluhan` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rekam_medis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pendaftaranId` INTEGER NOT NULL,
    `diagnosis` TEXT NOT NULL,
    `tindakan` TEXT NOT NULL,
    `resep` TEXT NULL,
    `catatan` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `rekam_medis_pendaftaranId_key`(`pendaftaranId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `jadwal_praktek` ADD CONSTRAINT `jadwal_praktek_dokterId_fkey` FOREIGN KEY (`dokterId`) REFERENCES `dokter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pendaftaran` ADD CONSTRAINT `pendaftaran_pasienId_fkey` FOREIGN KEY (`pasienId`) REFERENCES `pasien`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pendaftaran` ADD CONSTRAINT `pendaftaran_jadwalPraktekId_fkey` FOREIGN KEY (`jadwalPraktekId`) REFERENCES `jadwal_praktek`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rekam_medis` ADD CONSTRAINT `rekam_medis_pendaftaranId_fkey` FOREIGN KEY (`pendaftaranId`) REFERENCES `pendaftaran`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
