-- Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS desalink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Switch to the newly created database
USE desalink;

--
-- Table structure for table `users`
--
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('Admin Desa', 'Petugas RT/RW') NOT NULL DEFAULT 'Petugas RT/RW',
  `rtRw` VARCHAR(10) DEFAULT NULL,
  `avatarUrl` VARCHAR(255) DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

--
-- Table structure for table `umkm`
--
CREATE TABLE IF NOT EXISTS `umkm` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `businessName` VARCHAR(255) NOT NULL,
  `ownerName` VARCHAR(255) NOT NULL,
  `nib` VARCHAR(20) DEFAULT NULL,
  `businessType` ENUM('Kuliner', 'Fashion', 'Kerajinan', 'Jasa', 'Pertanian') NOT NULL,
  `address` TEXT NOT NULL,
  `rtRw` VARCHAR(10) NOT NULL,
  `contact` VARCHAR(20) NOT NULL,
  `status` ENUM('aktif', 'tidak aktif') NOT NULL DEFAULT 'aktif',
  `startDate` DATE DEFAULT NULL,
  `employeeCount` INT DEFAULT 0,
  `description` TEXT DEFAULT NULL,
  `imageUrl` VARCHAR(255) DEFAULT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

--
-- Dumping data for table `users`
-- Note: Passwords are hashed with bcrypt. The plain text for all is 'password123'
--
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `rtRw`, `avatarUrl`) VALUES
(1, 'Admin Desa Utama', 'admin@desa.com', '$2a$10$f.wPrtjQ2U5g8L3F..apu.3rGDB2qztXsyTnsi20gV2sWsoj3wK16', 'Admin Desa', '-', 'https://placehold.co/100x100.png?text=AD'),
(2, 'Budi Santoso', 'petugas.rtrw01@desa.com', '$2a$10$f.wPrtjQ2U5g8L3F..apu.3rGDB2qztXsyTnsi20gV2sWsoj3wK16', 'Petugas RT/RW', '001/001', 'https://placehold.co/100x100.png?text=BS'),
(3, 'Citra Lestari', 'petugas.rtrw02@desa.com', '$2a$10$f.wPrtjQ2U5g8L3F..apu.3rGDB2qztXsyTnsi20gV2sWsoj3wK16', 'Petugas RT/RW', '002/001', 'https://placehold.co/100x100.png?text=CL');

--
-- Dumping data for table `umkm`
--
INSERT INTO `umkm` (`businessName`, `ownerName`, `nib`, `businessType`, `address`, `rtRw`, `contact`, `status`, `startDate`, `employeeCount`, `description`, `imageUrl`) VALUES
('Warung Makan Bu Siti', 'Siti Rahayu', '1234567890123', 'Kuliner', 'Jl. Merdeka No. 10, Dusun Bahagia', '001/001', '081234567890', 'aktif', '2022-01-15', 3, 'Menyediakan masakan rumahan khas sunda dengan resep turun temurun.', 'https://placehold.co/600x400.png'),
('Berkah Tani Mandiri', 'Joko Susilo', '2345678901234', 'Pertanian', 'Jl. Sawah Lega No. 5', '001/001', '081234567891', 'aktif', '2021-03-20', 5, 'Kelompok tani yang menjual hasil panen segar langsung dari kebun.', 'https://placehold.co/600x400.png'),
('Fashionista Corner', 'Rina Melati', '3456789012345', 'Fashion', 'Jl. Gaya No. 1', '002/001', '081234567892', 'aktif', '2023-05-10', 2, 'Butik fashion yang menjual pakaian wanita modern dan aksesoris.', 'https://placehold.co/600x400.png'),
('Bengkel Motor Pak Eko', 'Eko Prasetyo', NULL, 'Jasa', 'Jl. Otomotif No. 22', '002/001', '081234567893', 'aktif', '2020-11-01', 4, 'Jasa servis motor dan penjualan sparepart original.', 'https://placehold.co/600x400.png'),
('Kriya Kayu Jati', 'Agus Setiawan', '4567890123456', 'Kerajinan', 'Jl. Pengrajin No. 8', '001/001', '081234567894', 'aktif', '2019-08-17', 6, 'Membuat berbagai macam kerajinan tangan dari bahan dasar kayu jati pilihan.', 'https://placehold.co/600x400.png'),
('Catering Lezat', 'Dewi Anggraini', NULL, 'Kuliner', 'Jl. Dapur Umum No. 3', '002/001', '081234567895', 'tidak aktif', '2021-06-01', 2, 'Menyediakan jasa catering untuk berbagai acara.', 'https://placehold.co/600x400.png');
