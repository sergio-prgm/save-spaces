// import Database from "better-sqlite3";
// import { drizzle } from "drizzle-orm/better-sqlite3";
import { drizzle } from "drizzle-orm/libsql";
import { type Client, createClient } from "@libsql/client";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Client;
};

export const conn = globalForDb.conn ?? createClient({ url: env.DATABASE_URL });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
export const adapter = new DrizzleSQLiteAdapter(
  db,
  schema.sessions,
  schema.users,
);

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */

/*
const globalForDb = globalThis as unknown as {
  conn: Database.Database | undefined;
};
*/

/*
export const conn =
  globalForDb.conn ?? new Database(env.DATABASE_URL, { fileMustExist: false });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
*/

/*
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);
*/
