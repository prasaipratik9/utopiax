/*
  curl examples (after login → TOKEN=...):

  curl -s http://localhost:4000/api/media
  curl -s -X POST http://localhost:4000/api/media \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d '{"title":"Talk","type":"video","url":"https://example.com/v","thumbnail_url":"https://res.cloudinary.com/.../thumb.jpg"}'
  curl -s -X PUT http://localhost:4000/api/media/<id> \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d '{"is_published":true}'
  curl -s -X DELETE http://localhost:4000/api/media/<id> \
    -H "Authorization: Bearer $TOKEN"
*/

import { Router } from "express";
import { optionalAuth, requireAuth } from "../middleware/requireAuth.js";
import { requireDb } from "../middleware/requireDb.js";

const TYPES = new Set(["video", "article", "podcast", "press"]);
const router = Router();

router.use(requireDb);

router.get("/", optionalAuth, async (req, res) => {
  try {
    let query = req.supabase
      .from("media")
      .select("*")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (!req.user) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ items: data || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not list media" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const title = String(req.body?.title || "").trim();
    const type = String(req.body?.type || "").trim();
    if (!title) return res.status(400).json({ error: "title is required" });
    if (!TYPES.has(type)) {
      return res.status(400).json({
        error: "type must be one of: video, article, podcast, press",
      });
    }

    const row = {
      title,
      type,
      url: req.body?.url ?? null,
      thumbnail_url: req.body?.thumbnail_url ?? null,
      published_at: req.body?.published_at ?? null,
      is_published: req.body?.is_published !== false,
    };

    const { data, error } = await req.supabase
      .from("media")
      .insert(row)
      .select("*")
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not create media item" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const patch = {};

    if (req.body?.title !== undefined) patch.title = String(req.body.title).trim();
    if (req.body?.type !== undefined) {
      const type = String(req.body.type).trim();
      if (!TYPES.has(type)) {
        return res.status(400).json({
          error: "type must be one of: video, article, podcast, press",
        });
      }
      patch.type = type;
    }
    if (req.body?.url !== undefined) patch.url = req.body.url;
    if (req.body?.thumbnail_url !== undefined) {
      patch.thumbnail_url = req.body.thumbnail_url;
    }
    if (req.body?.published_at !== undefined) patch.published_at = req.body.published_at;
    if (req.body?.is_published !== undefined) {
      patch.is_published = Boolean(req.body.is_published);
    }

    const { data, error } = await req.supabase
      .from("media")
      .update(patch)
      .eq("id", req.params.id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Media item not found" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not update media item" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from("media")
      .delete()
      .eq("id", req.params.id)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Media item not found" });
    res.json({ ok: true, id: data.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not delete media item" });
  }
});

export default router;
