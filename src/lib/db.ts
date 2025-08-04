import mysql from 'mysql2/promise';

// Membuat koneksi pool ke database
// Detail koneksi diambil dari variabel lingkungan
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware untuk memastikan koneksi dapat dibuat
// Ini akan menampilkan error di console jika koneksi gagal
pool.getConnection()
  .then(conn => {
    console.log("Successfully connected to the database.");
    conn.release();
  })
  .catch(err => {
    console.error("Failed to connect to the database:", err);
  });


export default pool;
