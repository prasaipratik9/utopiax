/*
  curl examples (after login → TOKEN=...):

  curl -s -X POST http://localhost:4000/api/newsletter/subscribe \
    -H "Content-Type: application/json" \
    -d '{"email":"seeker@example.com"}'
  curl -s http://localhost:4000/api/newsletter/subscribers \
    -H "Authorization: Bearer $TOKEN"
*/

import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireDb } from "../middleware/requireDb.js";

const router = Router();

router.use(requireDb);

router.post("/subscribe", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // ON CONFLICT DO NOTHING — unique email; re-subscribe is a no-op
    const { data, error } = await req.supabase
      .from("newsletter_subscribers")
      .upsert(
        { email, is_active: true },
        { onConflict: "email", ignoreDuplicates: true },
      )
      .select("*")
      .maybeSingle();

    if (error) throw error;

    res.status(201).json({
      ok: true,
      subscribed: true,
      // null when duplicate ignored
      subscriber: data || { email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not subscribe" });
  }
});

router.get("/subscribers", requireAuth, async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });

    if (error) throw error;
    res.json({ items: data || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not list subscribers" });
  }
});

export default router;
