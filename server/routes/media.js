/*
  curl examples (after login → TOKEN=...):

  curl -s http://localhost:4000/api/media
  curl -s http://localhost:4000/api/media/my-article-slug
  curl -s -X POST http://localhost:4000/api/media \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d '{"title":"Talk","type":"article","category":"openmindx","slug":"talk","excerpt":"…","content":"<p>…</p>"}'
*/

import { Router } from "express";
import { optionalAuth, requireAuth } from "../middleware/requireAuth.js";
import { requireDb } from "../middleware/requireDb.js";

const TYPES = new Set(["image", "video", "document", "article"]);
const CATEGORIES = new Set(["openmindx", "ideationworx", "lumierex"]);
const router = Router();

router.use(requireDb);

export function slugify(title) {
  return String(title || "")
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "item";
}

async function uniqueSlug(supabase, base, excludeId = null) {
  let candidate = base;
  let n = 2;
  for (;;) {
    let query = supabase
      .from("media")
      .select("id", { count: "exact", head: true })
      .eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { count, error } = await query;
    if (error) throw error;
    if (!count) return candidate;
    candidate = `${base}-${n}`;
    n += 1;
  }
}

function parseMediaBody(body, { partial = false } = {}) {
  const out = {};

  if (!partial || body.title !== undefined) {
    const title = String(body?.title || "").trim();
    if (!title && !partial) throw Object.assign(new Error("title is required"), { status: 400 });
    if (body.title !== undefined) out.title = title;
  }

  if (!partial || body.type !== undefined) {
    const type = String(body?.type || "").trim();
    if (!TYPES.has(type)) {
      throw Object.assign(
        new Error("type must be one of: image, video, document, article"),
        { status: 400 },
      );
    }
    out.type = type;
  }

  if (body.category !== undefined) {
    const category = body.category ? String(body.category).trim() : null;
    if (category && !CATEGORIES.has(category)) {
      throw Object.assign(
        new Error("category must be one of: openmindx, ideationworx, lumierex"),
        { status: 400 },
      );
    }
    out.category = category;
  }

  if (body.content !== undefined) out.content = body.content ?? null;
  if (body.excerpt !== undefined) out.excerpt = body.excerpt ?? null;
  if (body.url !== undefined) out.url = body.url ?? null;
  if (body.thumbnail_url !== undefined) out.thumbnail_url = body.thumbnail_url ?? null;
  if (body.published_at !== undefined) out.published_at = body.published_at ?? null;
  if (body.is_published !== undefined) out.is_published = Boolean(body.is_published);
  if (body.slug !== undefined) {
    out.slug = body.slug ? slugify(body.slug) : null;
  }

  return out;
}

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

router.get("/:slug", async (req, res) => {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) return res.status(400).json({ error: "slug is required" });

    const { data, error } = await req.supabase
      .from("media")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Media item not found" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not load media item" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const row = parseMediaBody(req.body || {}, { partial: false });
    if (row.is_published === undefined) row.is_published = true;

    const baseSlug = row.slug || slugify(row.title);
    row.slug = await uniqueSlug(req.supabase, baseSlug);

    const { data, error } = await req.supabase
      .from("media")
      .insert(row)
      .select("*")
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Could not create media item" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const patch = parseMediaBody(req.body || {}, { partial: true });

    if (patch.slug) {
      patch.slug = await uniqueSlug(req.supabase, patch.slug, req.params.id);
    } else if (patch.title && req.body?.slug === undefined) {
      // keep existing slug unless explicitly sent
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
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Could not update media item" });
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
