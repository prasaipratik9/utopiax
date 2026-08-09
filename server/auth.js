import bcrypt from "bcryptjs";
import { getSupabase, isDbConfigured } from "./db.js";

const ADMIN_USER = () => process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = () => process.env.ADMIN_PASSWORD || "utopiax-admin";

/**
 * Verify admin credentials.
 * Prefers Supabase `users` table when DB is configured; falls back to env.
 */
export async function verifyAdmin(username, password) {
  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, password_hash, role")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      console.error("User lookup failed:", error.message);
      throw new Error("Could not verify credentials");
    }

    if (data?.password_hash) {
      const ok = await bcrypt.compare(password, data.password_hash);
      return ok
        ? {
            username: data.username,
            id: data.id,
            role: data.role || "admin",
          }
        : null;
    }

    // Table empty / user missing — allow env bootstrap once, then optional seed
    if (username === ADMIN_USER() && password === ADMIN_PASSWORD()) {
      await ensureBootstrapAdmin(supabase);
      return { username: ADMIN_USER(), id: null, role: "admin" };
    }

    return null;
  }

  if (username === ADMIN_USER() && password === ADMIN_PASSWORD()) {
    return { username: ADMIN_USER(), id: null, role: "admin" };
  }
  return null;
}

async function ensureBootstrapAdmin(supabase) {
  const username = ADMIN_USER();
  const { count } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true });

  if (count && count > 0) return;

  const password_hash = await bcrypt.hash(ADMIN_PASSWORD(), 10);
  const { error } = await supabase.from("users").insert({
    username,
    password_hash,
    role: "admin",
  });

  if (error) {
    console.warn("Could not seed bootstrap admin:", error.message);
  } else {
    console.log(`Seeded bootstrap admin "${username}" into Supabase`);
  }
}

export function authMode() {
  return isDbConfigured() ? "supabase+env-fallback" : "env-only";
}
