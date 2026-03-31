import Database from 'better-sqlite3';
import path from 'path';
import { Submission, ReviewAction } from './types';

const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../../data.db');

let db: Database.Database;

export function initDB(): void {
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  // 迁移：为旧表添加 image 列
  const tableInfo = db.prepare("PRAGMA table_info(submissions)").all() as { name: string }[];
  if (tableInfo.length > 0 && !tableInfo.find(col => col.name === 'image')) {
    db.exec("ALTER TABLE submissions ADD COLUMN image TEXT NOT NULL DEFAULT ''");
  }
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      message TEXT NOT NULL,
      config TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export function insertSubmission(username: string, message: string, config: string, image: string): Submission {
  const stmt = db.prepare(
    'INSERT INTO submissions (username, message, config, image) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(username, message, config, image);
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
