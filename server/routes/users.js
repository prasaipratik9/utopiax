/*
  curl examples (after login → TOKEN=...):

  curl -s http://localhost:4000/api/users \
    -H "Authorization: Bearer $TOKEN"
  curl -s -X PATCH http://localhost:4000/api/users/<id>/role \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d '{"role":"editor"}'
*/

import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireDb } from "../middleware/requireDb.js";

const ROLES = new Set(["admin", "editor"]);
const router = Router();

router.use(requireDb);
router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from("users")
      .select("id, username, role, created_at")
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.json({ items: data || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not list users" });
  }
});

router.patch("/:id/role", async (req, res) => {
  try {
    const role = String(req.body?.role || "").trim();
    if (!ROLES.has(role)) {
      return res.status(400).json({
        error: "role must be one of: admin, editor",
      });
    }

    const { data, error } = await req.supabase
      .from("users")
      .update({ role })
      .eq("id", req.params.id)
      .select("id, username, role, created_at")
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "User not found" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not update role" });
  }
});

export default router;
