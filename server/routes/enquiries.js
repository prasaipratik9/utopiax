/*
  curl examples (after login → TOKEN=...):

  curl -s -X POST http://localhost:4000/api/enquiries \
    -H "Content-Type: application/json" \
    -d '{"name":"Ada","email":"ada@example.com","interest":"OpenMindX","message":"Hi"}'
  curl -s "http://localhost:4000/api/enquiries?status=new" \
    -H "Authorization: Bearer $TOKEN"
*/

import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireDb } from "../middleware/requireDb.js";

const STATUSES = new Set(["new", "read", "replied", "archived"]);
const router = Router();

router.use(requireDb);

router.post("/", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim();
    const message = String(req.body?.message || "").trim();
    const interest = req.body?.interest
      ? String(req.body.interest).trim()
      : null;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "name, email, and message are required",
      });
    }

    const row = {
      name,
      email,
      interest,
      message,
      status: "new",
      emailed: false,
    };

    const { data, error } = await req.supabase
      .from("enquiries")
      .insert(row)
      .select("*")
      .single();

    if (error) throw error;

    // TODO(Week 3): send enquiry notification via Nodemailer, then flip emailed=true

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not create enquiry" });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    let query = req.supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    const status = req.query.status ? String(req.query.status) : null;
    if (status) {
      if (!STATUSES.has(status)) {
        return res.status(400).json({
          error: "status must be one of: new, read, replied, archived",
        });
      }
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ items: data || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not list enquiries" });
  }
});

export default router;
