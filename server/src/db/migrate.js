/**
 * Apply SQL files in server/src/db/migrations/ in order.
 *
 * Requires DATABASE_URL (Postgres connection string from Supabase:
 * Project Settings → Database → Connection string → URI).
 *
 * If `pg` is not installed, prints the SQL paths so you can paste into
 * the Supabase SQL editor instead.
 *
 * Usage: npm run migrate
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, "../..");
dotenv.config({ path: path.join(serverRoot, ".env") });
dotenv.config({ path: path.join(serverRoot, "../.env") });

const migrationsDir = path.join(__dirname, "migrations");

async function main() {
  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (!files.length) {
    console.log("No migration SQL files found.");
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log("DATABASE_URL is not set.");
    console.log("Either add it to server/.env, or run these files in the Supabase SQL editor:");
    for (const f of files) {
      console.log(`  - ${path.join(migrationsDir, f)}`);
    }
    process.exit(1);
  }

  let pg;
  try {
    pg = await import("pg");
  } catch {
    console.error(
      'Package "pg" is not installed. Ask to run: npm install pg --workspace=server',
    );
    console.log("Or paste these SQL files into the Supabase SQL editor:");
    for (const f of files) {
      console.log(`  - ${path.join(migrationsDir, f)}`);
    }
    process.exit(1);
  }

  const client = new pg.default.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    for (const file of files) {
      const full = path.join(migrationsDir, file);
      const sql = await readFile(full, "utf8");
      console.log(`Applying ${file}…`);
      await client.query(sql);
      console.log(`  ok`);
    }
  } finally {
    await client.end();
  }

  console.log("Migrations complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
