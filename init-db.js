
// Use require for Node.js environment
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration from .env file
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

// SQL statements to create tables
const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Admin Desa', 'Petugas RT/RW') NOT NULL,
  rtRw VARCHAR(7) NOT NULL,
  avatarUrl VARCHAR(255)
);`;

const createUmkmTableQuery = `
CREATE TABLE IF NOT EXISTS umkm (
  id VARCHAR(255) PRIMARY KEY,
  businessName VARCHAR(255) NOT NULL,
  ownerName VARCHAR(255) NOT NULL,
  nib VARCHAR(255),
  businessType ENUM('Kuliner', 'Fashion', 'Kerajinan', 'Jasa', 'Pertanian') NOT NULL,
  address TEXT NOT NULL,
  rtRw VARCHAR(7) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  status ENUM('aktif', 'tidak aktif') NOT NULL,
  legality ENUM('Lengkap', 'Tidak Lengkap', 'Sedang Diproses') NOT NULL,
  startDate DATE,
  employeeCount INT DEFAULT 0,
  description TEXT,
  imageUrl VARCHAR(255),
  legalityDocumentUrl VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

// Main function to connect and create tables
async function initializeDatabase() {
  let connection;
  try {
    // Create a connection without specifying the database first
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });
    console.log('Successfully connected to MySQL server.');

    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    console.log(`Database "${dbConfig.database}" is ready.`);
    
    // Close initial connection and reconnect to the specific database
    await connection.end();

    // Reconnect with the database selected
    connection = await mysql.createConnection(dbConfig);
    console.log(`Successfully re-connected to "${dbConfig.database}" database.`);

    // Create the users table
    await connection.execute(createUsersTableQuery);
    console.log('Table "users" created or already exists.');

    // Create the umkm table
    await connection.execute(createUmkmTableQuery);
    console.log('Table "umkm" created or already exists.');

    console.log('\nDatabase initialization complete! You can now run the application.');

  } catch (error) {
    console.error('Error during database initialization:', error.message);
    if (error.code === 'ECONNREFUSED') {
        console.error('Connection refused. Is the MySQL server running and accessible?');
    }
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('Access denied. Please check your MYSQL_USER and MYSQL_PASSWORD in the .env file.');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connection closed.');
    }
  }
}

// Run the initialization
initializeDatabase();
