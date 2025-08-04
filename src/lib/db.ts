
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';

// This is a singleton to ensure we only have one database connection.
let dbInstance: Awaited<ReturnType<typeof open>> | null = null;

export async function getDbConnection() {
  if (dbInstance) {
    return dbInstance;
  }
  
  try {
    const dbPath = path.join(process.cwd(), 'desalink.sqlite');
    
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    
    console.log("Successfully connected to the SQLite database.");
    dbInstance = db;
    return db;
  } catch (error) {
    console.error("Failed to connect to the SQLite database.", error);
    throw new Error("Failed to connect to the database.");
  }
}

// Helper function to execute queries
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
    const db = await getDbConnection();
    try {
        console.log(`Executing query: ${query}`, params);
        // For SELECT queries
        if (query.trim().toUpperCase().startsWith('SELECT')) {
            const results = await db.all<T>(query, params);
            return results;
        }
        // For INSERT, UPDATE, DELETE queries
        else {
            const result = await db.run(query, params);
            // For INSERT, return the last inserted ID. For others, the number of changes.
            return { lastID: result.lastID, changes: result.changes } as T;
        }
    } catch (err: any) {
        console.error('Database query error:', err.message);
        throw new Error('Terjadi kesalahan pada server database.');
    }
}
