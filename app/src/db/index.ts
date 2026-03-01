import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const DB_PATH = process.env.DATABASE_PATH || "./lisq.db";

const sqlite = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// Auto-create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS lists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL DEFAULT 'general',
    icon TEXT DEFAULT 'list',
    color TEXT DEFAULT '#6366f1',
    mode TEXT NOT NULL DEFAULT 'checklist',
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    list_id TEXT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    parent_id TEXT,
    content TEXT NOT NULL,
    checked INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    quantity INTEGER,
    priority TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    pinned INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE INDEX IF NOT EXISTS idx_items_list_id ON items(list_id);
  CREATE INDEX IF NOT EXISTS idx_items_sort_order ON items(list_id, sort_order);
  CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(pinned);
  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
`);

// Migration: add mode column for existing databases
try {
  const cols = sqlite.prepare("PRAGMA table_info(lists)").all() as {
    name: string;
  }[];
  if (!cols.some((c) => c.name === "mode")) {
    sqlite.exec(
      "ALTER TABLE lists ADD COLUMN mode TEXT NOT NULL DEFAULT 'checklist'",
    );
  }
} catch (_) {}

// Migration: add parent_id column for existing databases
try {
  const itemCols = sqlite.prepare("PRAGMA table_info(items)").all() as {
    name: string;
  }[];
  if (!itemCols.some((c) => c.name === "parent_id")) {
    sqlite.exec("ALTER TABLE items ADD COLUMN parent_id TEXT");
  }
  // Create index after ensuring column exists
  sqlite.exec(
    "CREATE INDEX IF NOT EXISTS idx_items_parent_id ON items(parent_id)",
  );
} catch (_) {}

// Migration: add color column to items for existing databases
try {
  const itemCols2 = sqlite.prepare("PRAGMA table_info(items)").all() as {
    name: string;
  }[];
  if (!itemCols2.some((c) => c.name === "color")) {
    sqlite.exec("ALTER TABLE items ADD COLUMN color TEXT");
  }
} catch (_) {}

export const db = drizzle(sqlite, { schema });

// Provision user from env vars on startup (async, fire-and-forget)
import("../lib/auth").then((auth) => auth.provisionUser()).catch(() => {});
