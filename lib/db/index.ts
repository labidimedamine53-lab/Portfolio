import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const url = process.env.DATABASE_URL ?? "file:./local.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

const client = createClient({
  url,
  ...(authToken ? { authToken } : {}),
});

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS contact_messages (
    id integer PRIMARY KEY AUTOINCREMENT,
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    locale text,
    user_agent text,
    ip_hash text,
    created_at text NOT NULL DEFAULT (CURRENT_TIMESTAMP)
  )`,
  `CREATE TABLE IF NOT EXISTS page_views (
    id integer PRIMARY KEY AUTOINCREMENT,
    path text NOT NULL,
    referrer text,
    country text,
    user_agent text,
    session_hash text,
    created_at text NOT NULL DEFAULT (CURRENT_TIMESTAMP)
  )`,
  `CREATE TABLE IF NOT EXISTS rate_limit_buckets (
    key text NOT NULL,
    window_start integer NOT NULL,
    count integer NOT NULL DEFAULT 0
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS rate_limit_buckets_key_window_unique
    ON rate_limit_buckets (key, window_start)`,
  `CREATE INDEX IF NOT EXISTS rate_limit_buckets_window_idx
    ON rate_limit_buckets (window_start)`,
];

let ensureSchemaPromise: Promise<void> | null = null;

async function initializeSchema() {
  for (const statement of schemaStatements) {
    await client.execute(statement);
  }
}

export function ensureDatabase() {
  ensureSchemaPromise ??= initializeSchema().catch((err) => {
    ensureSchemaPromise = null;
    throw err;
  });
  return ensureSchemaPromise;
}

export const db = drizzle(client, { schema });
export { schema };
