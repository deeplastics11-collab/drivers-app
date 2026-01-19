import Database from 'better-sqlite3';
import path from 'path';

// For Next.js in development, we don't want to re-open the DB constantly on hot reloads if strict.
// But better-sqlite3 is synchronous and file-based, so it's generally fine to simple open dependent on scope.
// However, ensuring the path is correct relative to the running process (project root) is key.

const dbPath = path.join(process.cwd(), 'scripts', 'drivers-app.db');

let db;

try {
    db = new Database(dbPath, { fileMustExist: true });
} catch (error) {
    console.error("Database not found! Did you run 'node scripts/init-db.js'?");
    // Fallback or re-throw, depending on preference. For now, let's just log.
    // In production we might want to fail hard.
}

export default db;
