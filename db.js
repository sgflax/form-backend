import Database from 'better-sqlite3';

const dbPath = process.env.RAILWAY_ENVIRONMENT ? '/data/form.db' : 'form.db';
const db = new Database('form.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS pieces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vertices TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;