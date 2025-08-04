const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
require('dotenv').config();

// SQL statements to create tables for SQLite
const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT CHECK(role IN ('Admin Desa', 'Petugas RT/RW')) NOT NULL,
  rtRw TEXT NOT NULL,
  avatarUrl TEXT
);`;

const createUmkmTableQuery = `
CREATE TABLE IF NOT EXISTS umkm (
  id TEXT PRIMARY KEY,
  businessName TEXT NOT NULL,
  ownerName TEXT NOT NULL,
  nib TEXT,
  businessType TEXT CHECK(businessType IN ('Kuliner', 'Fashion', 'Kerajinan', 'Jasa', 'Pertanian')) NOT NULL,
  address TEXT NOT NULL,
  rtRw TEXT NOT NULL,
  contact TEXT NOT NULL,
  status TEXT CHECK(status IN ('aktif', 'tidak aktif')) NOT NULL,
  legality TEXT CHECK(legality IN ('Lengkap', 'Tidak Lengkap', 'Sedang Diproses')) NOT NULL,
  startDate TEXT,
  employeeCount INTEGER DEFAULT 0,
  description TEXT,
  imageUrl TEXT,
  legalityDocumentUrl TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);`;

const createManagementTableQuery = `
CREATE TABLE IF NOT EXISTS management (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  avatarUrl TEXT,
  aiHint TEXT
);`;

const insertManagementDataQuery = `
INSERT INTO management (name, position, phone, email, avatarUrl, aiHint) VALUES
('Bapak Widodo', 'Ketua RW 01', '0812-3456-7890', 'widodo@example.com', 'https://placehold.co/100x100.png?text=W', 'man portrait'),
('Bapak Susanto', 'Ketua RW 02', '0823-4567-8901', 'susanto@example.com', 'https://placehold.co/100x100.png?text=S', 'man portrait'),
('Ibu Hartini', 'Ketua RW 03', '0834-5678-9012', 'hartini@example.com', 'https://placehold.co/100x100.png?text=H', 'woman portrait'),
('Bapak Prabowo', 'Ketua RW 04', '0812-3456-7890', 'prabowo@example.com', 'https://placehold.co/100x100.png?text=P', 'man portrait'),
('Bapak Gibran', 'Ketua RW 05', '0823-4567-8901', 'gibran@example.com', 'https://placehold.co/100x100.png?text=G', 'man portrait'),
('Ibu Puan', 'Ketua RW 06', '0834-5678-9012', 'puan@example.com', 'https://placehold.co/100x100.png?text=P', 'woman portrait')
ON CONFLICT(name) DO NOTHING;
`;

// Main function to connect and create tables
async function initializeDatabase() {
  let db;
  try {
    // Open the database file
    db = await open({
      filename: './desalink.sqlite',
      driver: sqlite3.Database
    });
    console.log('Successfully connected to the SQLite database.');

    // Enable foreign key support
    await db.exec('PRAGMA foreign_keys = ON;');

    // Create the users table
    await db.exec(createUsersTableQuery);
    console.log('Table "users" created or already exists.');

    // Create the umkm table
    await db.exec(createUmkmTableQuery);
    console.log('Table "umkm" created or already exists.');
    
    // Create the management table
    await db.exec(createManagementTableQuery);
    console.log('Table "management" created or already exists.');

    // Insert initial management data
    await db.exec(insertManagementDataQuery);
    console.log('Initial management data inserted or already exists.');

    console.log('\nDatabase initialization complete! You can now run the application.');

  } catch (error) {
    console.error('Error during database initialization:', error.message);
  } finally {
    if (db) {
      await db.close();
      console.log('Connection closed.');
    }
  }
}

// Run the initialization
initializeDatabase();
