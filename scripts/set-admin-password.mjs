/**
 * Sets the admin password directly in Supabase.
 *
 *   node scripts/set-admin-password.mjs 'your-password-here'
 *
 * Run locally only. It reads DATABASE_PASSWORD from .env.local and hashes with
 * pgcrypto's bcrypt, which is what Supabase Auth expects - so the password
 * never travels anywhere and is never written to a file.
 *
 * Passing no argument generates a strong password and prints it once.
 */
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import pg from "pg";

const ADMIN_EMAIL = "suffynux@gmail.com";

const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#") || !t.includes("=")) continue;
  const i = t.indexOf("=");
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
}

const ref = env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
if (!ref || !env.DATABASE_PASSWORD) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or DATABASE_PASSWORD in .env.local");
  process.exit(1);
}

// A generated password avoids the weak ones people pick under time pressure.
const generated = !process.argv[2];
const password =
  process.argv[2] ??
  randomBytes(18).toString("base64url").replace(/[^A-Za-z0-9]/g, "").slice(0, 20);

if (password.length < 10) {
  console.error("Use at least 10 characters.");
  process.exit(1);
}

const client = new pg.Client({
  host: `aws-0-ap-south-1.pooler.supabase.com`,
  port: 5432,
  user: `postgres.${ref}`,
  password: env.DATABASE_PASSWORD,
  database: "postgres",
  ssl: { rejectUnauthorized: false }
});

await client.connect();

const { rowCount } = await client.query(
  `update auth.users
      set encrypted_password = crypt($2, gen_salt('bf')),
          updated_at = now()
    where email = $1`,
  [ADMIN_EMAIL, password]
);

await client.end();

if (rowCount === 0) {
  console.error(`No user found for ${ADMIN_EMAIL}. Apply migration 0005 first.`);
  process.exit(1);
}

console.log(`Password set for ${ADMIN_EMAIL}.`);
if (generated) {
  console.log(`\n  ${password}\n`);
  console.log("Save it now - it is not stored anywhere and will not be shown again.");
}
