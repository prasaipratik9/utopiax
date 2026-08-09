/*
  curl examples (after login → TOKEN=...):

  curl -s http://localhost:4000/api/services
  curl -s -X POST http://localhost:4000/api/services \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d '{"title":"Keynote","brand":"openmindx","slug":"keynote","description":"Talk"}'
  curl -s -X PUT http://localhost:4000/api/services/<id> \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d '{"title":"Keynote Updated"}'
  curl -s -X DELETE http://localhost:4000/api/services/<id> \
    -H "Authorization: Bearer $TOKEN"
*/

import { Router } from "express";
import { optionalAuth, requireAuth } from "../middleware/requireAuth.js";
import { requireDb } from "../middleware/requireDb.js";

const BRANDS = new Set(["openmindx", "ideationworx", "lumierex"]);
const router = Router();

router.use(requireDb);

router.get("/", optionalAuth, async (req, res) => {
  try {
    let query = req.supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (!req.user) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ items: data || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not list services" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const title = String(req.body?.title || "").trim();
    const brand = String(req.body?.brand || "").trim();
    if (!title) return res.status(400).json({ error: "title is required" });
    if (!BRANDS.has(brand)) {
      return res.status(400).json({
        error: "brand must be one of: openmindx, ideationworx, lumierex",
      });
    }

    const row = {
      title,
      brand,
      description: req.body?.description ?? null,
      slug: req.body?.slug ? String(req.body.slug).trim() : null,
      is_published: req.body?.is_published !== false,
      sort_order: Number.isFinite(Number(req.body?.sort_order))
        ? Number(req.body.sort_order)
        : 0,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await req.supabase
      .from("services")
      .insert(row)
      .select("*")
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not create service" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const patch = { updated_at: new Date().toISOString() };

    if (req.body?.title !== undefined) patch.title = String(req.body.title).trim();
    if (req.body?.brand !== undefined) {
      const brand = String(req.body.brand).trim();
      if (!BRANDS.has(brand)) {
        return res.status(400).json({
          error: "brand must be one of: openmindx, ideationworx, lumierex",
        });
      }
      patch.brand = brand;
    }
    if (req.body?.description !== undefined) patch.description = req.body.description;
    if (req.body?.slug !== undefined) {
      patch.slug = req.body.slug ? String(req.body.slug).trim() : null;
    }
    if (req.body?.is_published !== undefined) {
      patch.is_published = Boolean(req.body.is_published);
    }
    if (req.body?.sort_order !== undefined) {
      patch.sort_order = Number(req.body.sort_order) || 0;
    }

    const { data, error } = await req.supabase
      .from("services")
      .update(patch)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Service not found" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not update service" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from("services")
      .delete()
      .eq("id", req.params.id)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Service not found" });
    res.json({ ok: true, id: data.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not delete service" });
  }
});

export default router;
