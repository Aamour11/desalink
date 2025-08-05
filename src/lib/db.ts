
import mysql from 'mysql2/promise';
import type { RowDataPacket, FieldPacket } from 'mysql2';

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function getDbConnection() {
  if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_DATABASE) {
      throw new Error("Database environment variables are not configured correctly.");
  }
  return pool.getConnection();
}


/**
 * Executes a SQL query with parameters and returns the result.
 * It handles the connection acquisition and release automatically.
 * @param query The SQL query string with ? placeholders for parameters.
 * @param params An array of parameters to be safely substituted into the query.
 * @returns A promise that resolves with the query results.
 */
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(query, params);
        // We cast to T, assuming the caller knows the expected shape of the result.
        return rows as T;
    } catch (error) {
        console.error('Database Query Failed:', error);
        // In a real app, you might want a more sophisticated error handling/logging mechanism.
        throw new Error('Terjadi kesalahan pada server database.');
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the pool
        }
    }
}
