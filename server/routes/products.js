/*
  curl examples (after login → TOKEN=...):

  curl -s http://localhost:4000/api/products
  curl -s -X POST http://localhost:4000/api/products \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d '{"title":"Workbook","price_cents":4500,"currency":"AUD"}'
  curl -s -X PUT http://localhost:4000/api/products/<id> \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d '{"is_published":false}'
  curl -s -X DELETE http://localhost:4000/api/products/<id> \
    -H "Authorization: Bearer $TOKEN"
*/

import { Router } from "express";
import { optionalAuth, requireAuth } from "../middleware/requireAuth.js";
import { requireDb } from "../middleware/requireDb.js";

const router = Router();

router.use(requireDb);

router.get("/", optionalAuth, async (req, res) => {
  try {
    let query = req.supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!req.user) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ items: data || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not list products" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const title = String(req.body?.title || "").trim();
    if (!title) return res.status(400).json({ error: "title is required" });

    const row = {
      title,
      description: req.body?.description ?? null,
      price_cents:
        req.body?.price_cents === undefined || req.body?.price_cents === null
          ? null
          : Number(req.body.price_cents),
      currency: req.body?.currency ? String(req.body.currency) : "AUD",
      image_url: req.body?.image_url ?? null,
      is_published: req.body?.is_published !== false,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await req.supabase
      .from("products")
      .insert(row)
      .select("*")
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not create product" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const patch = { updated_at: new Date().toISOString() };

    if (req.body?.title !== undefined) patch.title = String(req.body.title).trim();
    if (req.body?.description !== undefined) patch.description = req.body.description;
    if (req.body?.price_cents !== undefined) {
      patch.price_cents =
        req.body.price_cents === null ? null : Number(req.body.price_cents);
    }
    if (req.body?.currency !== undefined) patch.currency = String(req.body.currency);
    if (req.body?.image_url !== undefined) patch.image_url = req.body.image_url;
    if (req.body?.is_published !== undefined) {
      patch.is_published = Boolean(req.body.is_published);
    }

    const { data, error } = await req.supabase
      .from("products")
      .update(patch)
      .eq("id", req.params.id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Product not found" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not update product" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from("products")
      .delete()
      .eq("id", req.params.id)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Product not found" });
    res.json({ ok: true, id: data.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not delete product" });
  }
});

export default router;
