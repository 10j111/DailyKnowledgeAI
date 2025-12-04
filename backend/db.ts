/**
 * DATABASE MODULE
 * 
 * NOTE: This file uses 'better-sqlite3' which is a Node.js binary module.
 * It cannot run in the browser preview environment.
 * In a real Electron app, this runs in the Main Process.
 */

// import Database from 'better-sqlite3';
// import path from 'path';
// import fs from 'fs';

// const DB_PATH = path.join(process.cwd(), 'daily-knowledge.db');

export class DatabaseManager {
  private db: any;

  constructor() {
    // this.db = new Database(DB_PATH, { verbose: console.log });
    this.init();
  }

  init() {
    console.log("Initializing Database Tables...");
    const schema = `
      -- 1. Sources: RSS feeds or websites
      CREATE TABLE IF NOT EXISTS sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT NOT NULL UNIQUE,
        category TEXT,
        is_active INTEGER DEFAULT 1,
        created_at INTEGER DEFAULT (unixepoch())
      );

      -- 2. Raw Articles: All scraped data
      CREATE TABLE IF NOT EXISTS raw_articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_id INTEGER,
        title TEXT,
        description TEXT,
        url TEXT UNIQUE,
        published_at INTEGER,
        fetched_at INTEGER DEFAULT (unixepoch()),
        FOREIGN KEY (source_id) REFERENCES sources(id)
      );

      -- 3. Daily Insights: AI Processed and filtered items
      CREATE TABLE IF NOT EXISTS daily_insights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL, -- YYYY-MM-DD
        category TEXT NOT NULL,
        raw_article_id INTEGER,
        title TEXT NOT NULL,
        summary TEXT,
        score INTEGER,
        url TEXT,
        source_name TEXT,
        created_at INTEGER DEFAULT (unixepoch()),
        FOREIGN KEY (raw_article_id) REFERENCES raw_articles(id)
      );

      -- 4. Collections: User Bookmarks
      CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        insight_id INTEGER,
        title TEXT,
        summary TEXT,
        url TEXT,
        category TEXT,
        tags TEXT, -- JSON string
        created_at INTEGER DEFAULT (unixepoch()),
        FOREIGN KEY (insight_id) REFERENCES daily_insights(id)
      );

      -- 5. Notes: User thoughts on collections
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        collection_id INTEGER NOT NULL,
        content TEXT,
        ai_tags TEXT, -- AI suggested tags
        updated_at INTEGER DEFAULT (unixepoch()),
        FOREIGN KEY (collection_id) REFERENCES collections(id)
      );

      -- 6. Weekly Reviews
      CREATE TABLE IF NOT EXISTS weekly_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        week_start TEXT,
        week_end TEXT,
        theme TEXT,
        summary TEXT,
        suggestions TEXT,
        created_at INTEGER DEFAULT (unixepoch())
      );

      -- 7. Settings
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT
      );

      -- 8. Logs
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        level TEXT,
        message TEXT,
        created_at INTEGER DEFAULT (unixepoch())
      );
    `;

    // this.db.exec(schema);
    console.log("Database initialized successfully.");
  }

  // --- CRUD Operations Examples ---

  // Settings Operations
  getSetting(key: string) {
    // const stmt = this.db.prepare('SELECT value FROM settings WHERE key = ?');
    // const result = stmt.get(key);
    // return result ? result.value : null;
    return null;
  }

  setSetting(key: string, value: string) {
    // const stmt = this.db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
    // return stmt.run(key, value);
  }

  insertSource(name: string, url: string, category: string) {
    // const stmt = this.db.prepare('INSERT OR IGNORE INTO sources (name, url, category) VALUES (?, ?, ?)');
    // return stmt.run(name, url, category);
  }

  getDailyInsights(date: string) {
    // const stmt = this.db.prepare('SELECT * FROM daily_insights WHERE date = ? ORDER BY score DESC');
    // return stmt.all(date);
  }

  addToCollection(insightId: number, title: string, summary: string, url: string, category: string) {
    // const stmt = this.db.prepare(`
    //   INSERT INTO collections (insight_id, title, summary, url, category)
    //   VALUES (?, ?, ?, ?, ?)
    // `);
    // return stmt.run(insightId, title, summary, url, category);
  }
}

// Singleton export
// export const db = new DatabaseManager();