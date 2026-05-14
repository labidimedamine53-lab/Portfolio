import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

function resolveDatabaseUrl() {
  const configuredUrl = process.env.DATABASE_URL?.trim();
  if (configuredUrl) return configuredUrl;

  // Serverless production bundles usually cannot write next to the app code.
  // Use the writable temp directory as a last-resort fallback so admin/contact
  // still work online, then encourage a hosted libSQL/Turso DB for persistence.
  if (process.env.NODE_ENV === "production" && process.platform !== "win32") {
    return "file:/tmp/portfolio.db";
  }

  return "file:./local.db";
}

const configuredDatabaseUrl = process.env.DATABASE_URL?.trim();
const url = resolveDatabaseUrl();
const authToken = process.env.DATABASE_AUTH_TOKEN?.trim();

export const databaseStatus = {
  configured: Boolean(configuredDatabaseUrl),
  temporary: !configuredDatabaseUrl && process.env.NODE_ENV === "production",
  usingLocalFile: url.startsWith("file:"),
};

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
