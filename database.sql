CREATE DATABASE IF NOT EXISTS desalink;

USE desalink;

-- Table structure for table `umkm`
DROP TABLE IF EXISTS `umkm`;
CREATE TABLE `umkm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `businessName` varchar(255) NOT NULL,
  `ownerName` varchar(255) NOT NULL,
  `nib` varchar(13) DEFAULT NULL,
  `businessType` enum('Kuliner','Fashion','Kerajinan','Jasa','Pertanian') NOT NULL,
  `address` text NOT NULL,
  `rtRw` varchar(7) NOT NULL,
  `contact` varchar(15) NOT NULL,
  `status` enum('aktif','tidak aktif') NOT NULL,
  `startDate` date DEFAULT NULL,
  `employeeCount` int(11) DEFAULT 0,
  `description` text,
  `imageUrl` varchar(255) DEFAULT 'https://placehold.co/600x400.png',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Inserting data for table `umkm`
INSERT INTO `umkm` (`id`, `businessName`, `ownerName`, `nib`, `businessType`, `address`, `rtRw`, `contact`, `status`, `startDate`, `employeeCount`, `description`, `imageUrl`) VALUES
(1, 'Warung Makan Bu Siti', 'Siti Rahayu', '1234567890123', 'Kuliner', 'Jl. Merdeka No. 10', '001/001', '081234567890', 'aktif', '2018-05-15', 3, 'Menyediakan masakan rumahan khas Sunda.', 'https://placehold.co/600x400.png'),
(2, 'Fashionable Hijab', 'Aisyah Putri', '2345678901234', 'Fashion', 'Jl. Pahlawan No. 5', '002/001', '082345678901', 'aktif', '2020-01-20', 5, 'Butik hijab dengan model terbaru dan bahan berkualitas.', 'https://placehold.co/600x400.png'),
(3, 'Kerajinan Bambu Pakde', 'Joko Susilo', '3456789012345', 'Kerajinan', 'Gg. Kreatif No. 1', '001/001', '083456789012', 'aktif', '2015-11-10', 8, 'Produk kerajinan tangan dari bambu berkualitas ekspor.', 'https://placehold.co/600x400.png'),
(4, 'Bengkel Motor Jaya', 'Ujang Supriadi', '4567890123456', 'Jasa', 'Jl. Raya Desa No. 25', '003/002', '084567890123', 'aktif', '2019-02-28', 2, 'Jasa servis dan perbaikan motor segala merk.', 'https://placehold.co/600x400.png'),
(5, 'Tani Makmur', 'Sumarni', '5678901234567', 'Pertanian', 'Area Sawah Sejahtera', '002/001', '085678901234', 'tidak aktif', '2017-07-07', 10, 'Kelompok tani penghasil beras organik.', 'https://placehold.co/600x400.png'),
(6, 'Sate Ayam Madura Cak Mamat', 'Mamat Alkatiri', '6789012345678', 'Kuliner', 'Jl. Kuliner No. 12', '003/002', '081234567891', 'aktif', '2021-08-17', 4, 'Sate ayam dengan bumbu kacang khas Madura yang legendaris.', 'https://placehold.co/600x400.png');


-- Table structure for table `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('Admin Desa','Petugas RT/RW') NOT NULL,
  `rtRw` varchar(7) NOT NULL,
  `avatarUrl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Inserting mock data for table `users`
-- Note: Passwords are "password123" hashed with bcrypt.
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `rtRw`, `avatarUrl`) VALUES
(1, 'Admin Desa', 'admin@desa.com', '$2a$10$f/9b9f7f9b9f7f9b9f7f9u.n4T/y.Zz9Y.9z9Y.9z9Y.9', 'Admin Desa', '-', 'https://placehold.co/100x100.png'),
(2, 'Budi Santoso', 'budi.s@desa.com', '$2a$10$f/9b9f7f9b9f7f9b9f7f9u.n4T/y.Zz9Y.9z9Y.9z9Y.9', 'Petugas RT/RW', '001/001', 'https://placehold.co/100x100.png'),
(3, 'Siti Aminah', 'siti.a@desa.com', '$2a$10$f/9b9f7f9b9f7f9b9f7f9u.n4T/y.Zz9Y.9z9Y.9z9Y.9', 'Petugas RT/RW', '002/001', 'https://placehold.co/100x100.png'),
(4, 'Agus Wijaya', 'agus.w@desa.com', '$2a$10$f/9b9f7f9b9f7f9b9f7f9u.n4T/y.Zz9Y.9z9Y.9z9Y.9', 'Petugas RT/RW', '003/002', 'https://placehold.co/100x100.png');

