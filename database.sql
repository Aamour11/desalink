-- DesaLink UMKM Database Schema

--
-- Table structure for table `users`
--
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('Admin Desa', 'Petugas RT/RW') NOT NULL,
  `rt_rw` VARCHAR(10) NULL COMMENT 'Required if role is Petugas RT/RW',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `umkm`
--
CREATE TABLE `umkm` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `business_name` VARCHAR(255) NOT NULL,
  `owner_name` VARCHAR(255) NOT NULL,
  `nib` VARCHAR(50) NULL,
  `business_type` ENUM('Kuliner', 'Fashion', 'Kerajinan', 'Jasa', 'Pertanian') NOT NULL,
  `address` TEXT NOT NULL,
  `rt_rw` VARCHAR(10) NOT NULL,
  `contact` VARCHAR(20) NOT NULL,
  `status` ENUM('aktif', 'tidak aktif') NOT NULL DEFAULT 'aktif',
  `start_date` DATE NULL,
  `employee_count` INT NULL,
  `description` TEXT NULL,
  `image_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` INT,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Sample data for `users`
--
INSERT INTO `users` (`name`, `email`, `password`, `role`, `rt_rw`) VALUES
('Admin Desa X', 'admin@desa.com', 'hashed_password', 'Admin Desa', NULL),
('Petugas RT 001/001', 'petugas001@desa.com', 'hashed_password', 'Petugas RT/RW', '001/001'),
('Petugas RT 002/001', 'petugas002@desa.com', 'hashed_password', 'Petugas RT/RW', '002/001');

