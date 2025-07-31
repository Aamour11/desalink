-- Membuat database baru
CREATE DATABASE IF NOT EXISTS desalink_umkm_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Menggunakan database yang baru dibuat
USE desalink_umkm_db;

-- ----------------------------
-- Struktur Tabel untuk `users`
-- ----------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `role` ENUM('Admin Desa', 'Petugas RT/RW') NOT NULL,
  `rtRw` VARCHAR(10) DEFAULT NULL,
  `avatarUrl` VARCHAR(255) DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Struktur Tabel untuk `umkm`
-- ----------------------------
CREATE TABLE IF NOT EXISTS `umkm` (
  `id` VARCHAR(50) NOT NULL,
  `businessName` VARCHAR(150) NOT NULL,
  `ownerName` VARCHAR(100) NOT NULL,
  `nib` VARCHAR(20) DEFAULT NULL,
  `businessType` ENUM('Kuliner', 'Fashion', 'Kerajinan', 'Jasa', 'Pertanian') NOT NULL,
  `address` TEXT,
  `rtRw` VARCHAR(10) NOT NULL,
  `contact` VARCHAR(20) DEFAULT NULL,
  `status` ENUM('aktif', 'tidak aktif') NOT NULL DEFAULT 'aktif',
  `startDate` DATE DEFAULT NULL,
  `employeeCount` INT(11) DEFAULT 0,
  `description` TEXT,
  `imageUrl` VARCHAR(255) DEFAULT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Menyisipkan data awal ke tabel `users`
-- ----------------------------
INSERT INTO `users` (`id`, `name`, `email`, `role`, `rtRw`, `avatarUrl`, `password`) VALUES
('user-1', 'Admin Desa', 'admin@desa.com', 'Admin Desa', '-', 'https://placehold.co/100x100.png', 'hashed_password_placeholder'),
('user-2', 'Budi Santoso', 'budi.s@desa.com', 'Petugas RT/RW', '001/001', 'https://placehold.co/100x100.png', 'hashed_password_placeholder'),
('user-3', 'Siti Aminah', 'siti.a@desa.com', 'Petugas RT/RW', '002/001', 'https://placehold.co/100x100.png', 'hashed_password_placeholder'),
('user-4', 'Agus Wijaya', 'agus.w@desa.com', 'Petugas RT/RW', '003/002', 'https://placehold.co/100x100.png', 'hashed_password_placeholder');

-- ----------------------------
-- Menyisipkan data awal ke tabel `umkm`
-- ----------------------------
INSERT INTO `umkm` (`id`, `businessName`, `ownerName`, `nib`, `businessType`, `address`, `rtRw`, `contact`, `status`, `startDate`, `employeeCount`, `description`, `imageUrl`) VALUES
('umkm-1', 'Warung Makan Bu Siti', 'Siti Rahayu', '1234567890123', 'Kuliner', 'Jl. Merdeka No. 10', '001/001', '081234567890', 'aktif', '2018-05-15', 3, 'Menyediakan masakan rumahan khas Sunda.', 'https://placehold.co/600x400.png'),
('umkm-2', 'Fashionable Hijab', 'Aisyah Putri', '2345678901234', 'Fashion', 'Jl. Pahlawan No. 5', '002/001', '082345678901', 'aktif', '2020-01-20', 5, 'Butik hijab dengan model terbaru dan bahan berkualitas.', 'https://placehold.co/600x400.png'),
('umkm-3', 'Kerajinan Bambu Pakde', 'Joko Susilo', '3456789012345', 'Kerajinan', 'Gg. Kreatif No. 1', '001/001', '083456789012', 'aktif', '2015-11-10', 8, 'Produk kerajinan tangan dari bambu berkualitas ekspor.', 'https://placehold.co/600x400.png'),
('umkm-4', 'Bengkel Motor Jaya', 'Ujang Supriadi', '4567890123456', 'Jasa', 'Jl. Raya Desa No. 25', '003/002', '084567890123', 'aktif', '2019-02-28', 2, 'Jasa servis dan perbaikan motor segala merk.', 'https://placehold.co/600x400.png'),
('umkm-5', 'Tani Makmur', 'Sumarni', '5678901234567', 'Pertanian', 'Area Sawah Sejahtera', '002/001', '085678901234', 'tidak aktif', '2017-07-07', 10, 'Kelompok tani penghasil beras organik.', 'https://placehold.co/600x400.png'),
('umkm-6', 'Sate Ayam Madura Cak Mamat', 'Mamat Alkatiri', '6789012345678', 'Kuliner', 'Jl. Kuliner No. 12', '003/002', '081234567891', 'aktif', '2021-08-17', 4, 'Sate ayam dengan bumbu kacang khas Madura yang legendaris.', 'https://placehold.co/600x400.png');
