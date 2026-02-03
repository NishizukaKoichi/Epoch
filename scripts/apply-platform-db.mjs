import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pgPkg from "pg";

const { Client } = pgPkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const repoRoot = path.resolve(__dirname, "..");
const envLocal = loadEnvFile(path.join(repoRoot, ".env.local"));
const envProductionLocal = loadEnvFile(path.join(repoRoot, ".env.production.local"));
const env = { ...envProductionLocal, ...envLocal, ...process.env };

const connectionString = env.PLATFORM_DATABASE_URL;
if (!connectionString) {
  console.error("PLATFORM_DATABASE_URL is not set (checked .env.local/.env.production.local)");
  process.exit(1);
}

const sqlPath = path.join(repoRoot, "db", "platform.sql");
const sql = fs.readFileSync(sqlPath, "utf8");

const statements = sql
  .split(/;\s*\n/)
  .map((stmt) => stmt.trim())
  .filter((stmt) => stmt.length > 0);

const client = new Client({ connectionString });

const ignoreCodes = new Set(["42P07", "42710"]); // relation or object already exists

try {
  await client.connect();
  for (const stmt of statements) {
    try {
      await client.query(stmt);
    } catch (err) {
      const code = err?.code;
      if (code && ignoreCodes.has(code)) {
        continue;
      }
      throw err;
    }
  }
  console.log("platform.sql applied successfully");
} catch (err) {
  console.error("Failed to apply platform.sql:", err);
  process.exitCode = 1;
} finally {
  await client.end();
}
