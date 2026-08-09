import { getSupabase } from "../db.js";

/** Attach Supabase client or 503 if env keys are missing. */
export function requireDb(req, res, next) {
  const supabase = getSupabase();
  if (!supabase) {
    return res.status(503).json({
      error: "Database not configured (set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)",
    });
  }
  req.supabase = supabase;
  return next();
}
