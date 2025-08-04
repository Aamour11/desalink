

// This file is temporarily disabled to prevent build errors.
// Database connection logic will be restored with a more stable driver.

export async function getDbConnection() {
  console.log("Database connection is currently disabled.");
  return null;
}

export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
    console.error('Database query is disabled. Query was:', query, params);
    throw new Error('Terjadi kesalahan pada server database.');
}
