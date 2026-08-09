/*
  curl examples (after login → TOKEN=...):

  curl -s -X POST http://localhost:4000/api/analytics/events \
    -H "Content-Type: application/json" \
    -d '{"event_type":"page_view","page":"/about","meta":{"ref":"nav"}}'
  curl -s http://localhost:4000/api/analytics/summary \
    -H "Authorization: Bearer $TOKEN"
*/

import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireDb } from "../middleware/requireDb.js";

const router = Router();

router.use(requireDb);

router.post("/events", async (req, res) => {
  try {
    const event_type = String(req.body?.event_type || "").trim();
    if (!event_type) {
      return res.status(400).json({ error: "event_type is required" });
    }

    const row = {
      event_type,
      page: req.body?.page ? String(req.body.page) : null,
      meta:
        req.body?.meta && typeof req.body.meta === "object" && !Array.isArray(req.body.meta)
          ? req.body.meta
          : {},
    };

    const { error } = await req.supabase.from("analytics_events").insert(row);
    if (error) throw error;

    // Fire-and-forget friendly: client can ignore body
    res.status(202).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not record event" });
  }
});

router.get("/summary", requireAuth, async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from("analytics_events")
      .select("event_type, page");

    if (error) throw error;

    const byEventType = {};
    const byPage = {};

    for (const row of data || []) {
      const type = row.event_type || "unknown";
      byEventType[type] = (byEventType[type] || 0) + 1;

      const page = row.page || "(none)";
      byPage[page] = (byPage[page] || 0) + 1;
    }

    res.json({
      total: (data || []).length,
      byEventType,
      byPage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not load summary" });
  }
});

export default router;
