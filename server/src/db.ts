import Database from 'better-sqlite3';
import path from 'path';
import { Submission, ReviewAction } from './types';

const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../../data.db');

let db: Database.Database;

export function initDB(): void {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      message TEXT NOT NULL,
      grade TEXT NOT NULL DEFAULT '',
      college TEXT NOT NULL DEFAULT '',
      identity TEXT NOT NULL DEFAULT '',
      config TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 迁移：为旧表添加缺失的列
  const tableInfo = db.prepare("PRAGMA table_info(submissions)").all() as { name: string }[];
  const cols = tableInfo.map(c => c.name);
  if (cols.length > 0) {
    if (!cols.includes('image'))   db.exec("ALTER TABLE submissions ADD COLUMN image TEXT NOT NULL DEFAULT ''");
    if (!cols.includes('grade'))   db.exec("ALTER TABLE submissions ADD COLUMN grade TEXT NOT NULL DEFAULT ''");
    if (!cols.includes('college')) db.exec("ALTER TABLE submissions ADD COLUMN college TEXT NOT NULL DEFAULT ''");
    if (!cols.includes('identity'))db.exec("ALTER TABLE submissions ADD COLUMN identity TEXT NOT NULL DEFAULT ''");
  }
}

export function insertSubmission(username: string, message: string, grade: string, college: string, identity: string, config: string, image: string): Submission {
  const stmt = db.prepare(
    'INSERT INTO submissions (username, message, grade, college, identity, config, image) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(username, message, grade, college, identity, config, image);
  return getSubmissionById(result.lastInsertRowid as number)!;
}

export function getSubmissionById(id: number): Submission | undefined {
  const stmt = db.prepare('SELECT * FROM submissions WHERE id = ?');
  return stmt.get(id) as Submission | undefined;
}

export function getAllSubmissions(): Submission[] {
  const stmt = db.prepare('SELECT * FROM submissions ORDER BY created_at DESC');
  return stmt.all() as Submission[];
}

export function getSubmissionsByStatus(status: string): Submission[] {
  const stmt = db.prepare('SELECT * FROM submissions WHERE status = ? ORDER BY created_at DESC');
  return stmt.all(status) as Submission[];
}

export function updateSubmissionStatus(id: number, action: ReviewAction): boolean {
  const stmt = db.prepare('UPDATE submissions SET status = ? WHERE id = ?');
  const result = stmt.run(action, id);
  return result.changes > 0;
}

export function deleteSubmission(id: number): boolean {
  const stmt = db.prepare('DELETE FROM submissions WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export function getApprovedSubmissions(): Submission[] {
  return getSubmissionsByStatus('approved');
}
