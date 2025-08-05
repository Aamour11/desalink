
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database connection details from .env
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

// --- DDL Statements ---

const CREATE_USERS_TABLE = `
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Admin Desa', 'Petugas RT/RW') NOT NULL,
  rtRw VARCHAR(10) NOT NULL,
  avatarUrl VARCHAR(255)
);
`;

const CREATE_UMKM_TABLE = `
CREATE TABLE IF NOT EXISTS umkm (
  id VARCHAR(36) PRIMARY KEY,
  businessName VARCHAR(255) NOT NULL,
  ownerName VARCHAR(255) NOT NULL,
  nib VARCHAR(20),
  businessType ENUM('Kuliner', 'Fashion', 'Kerajinan', 'Jasa', 'Pertanian') NOT NULL,
  address TEXT NOT NULL,
  rtRw VARCHAR(10) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  status ENUM('aktif', 'tidak aktif') NOT NULL DEFAULT 'aktif',
  legality ENUM('Lengkap', 'Tidak Lengkap', 'Sedang Diproses') NOT NULL,
  startDate DATE,
  endDate DATE,
  employeeCount INT,
  description TEXT,
  imageUrl VARCHAR(255),
  legalityDocumentUrl VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// --- Seed Data ---
const seedUsers = [
  {
    id: 'user-admin-1',
    name: 'Admin Desa',
    email: 'admin@desa.com',
    password: 'password', // Plain text, will be hashed
    role: 'Admin Desa',
    rtRw: '-',
    avatarUrl: 'https://placehold.co/100x100.png?text=AD'
  },
  {
    id: 'user-petugas-1',
    name: 'Ahmad Fauzi',
    email: 'petugas@desa.com',
    password: 'password', // Plain text, will be hashed
    role: 'Petugas RT/RW',
    rtRw: '001/001',
    avatarUrl: 'https://placehold.co/100x100.png?text=AF'
  },
  {
    id: 'user-petugas-2',
    name: 'Dewi Lestari',
    email: 'dewi.l@example.com',
    password: 'password',
    role: 'Petugas RT/RW',
    rtRw: '002/001',
    avatarUrl: 'https://placehold.co/100x100.png?text=DL'
  }
];


async function initializeDatabase() {
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
    console.error("❌ Error: Missing required environment variables for database connection.");
    console.error("Please check your .env file and ensure MYSQL_HOST, MYSQL_USER, and MYSQL_DATABASE are set.");
    process.exit(1);
  }
  
  let connection;
  try {
    // Connect without specifying a database first to create it if it doesn't exist
    console.log("Connecting to MySQL server...");
    connection = await mysql.createConnection({
      host: MYSQL_HOST,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
    });
    console.log("✅ Connected to MySQL server.");

    // Create the database if it doesn't exist
    console.log(`Creating database '${MYSQL_DATABASE}' if it does not exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\``);
    console.log("✅ Database is ready.");

    // Close the initial connection and reconnect to the specific database
    await connection.end();
    connection = await mysql.createConnection({
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE
    });
     console.log(`✅ Connected to '${MYSQL_DATABASE}' database.`);

    // Create tables
    console.log("Creating 'users' table...");
    await connection.execute(CREATE_USERS_TABLE);
    console.log("✅ 'users' table is ready.");
    
    console.log("Creating 'umkm' table...");
    await connection.execute(CREATE_UMKM_TABLE);
    console.log("✅ 'umkm' table is ready.");

    // Seed users
    console.log("Seeding initial user data...");
    for (const user of seedUsers) {
      const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', [user.email]);
      if (rows.length === 0) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await connection.execute(
          'INSERT INTO users (id, name, email, password_hash, role, rtRw, avatarUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [user.id, user.name, user.email, hashedPassword, user.role, user.rtRw, user.avatarUrl]
        );
        console.log(`- Seeded user: ${user.email}`);
      } else {
        console.log(`- User already exists: ${user.email}`);
      }
    }
    console.log("✅ User seeding complete.");

    console.log("\n✨ Database initialization successful! ✨");

  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Connection closed.");
    }
  }
}

initializeDatabase();
