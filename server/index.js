import cors from "cors";
import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = path.resolve(__dirname, "../client/src/data/content.json");
const PORT = Number(process.env.PORT) || 4000;

const app = express();
app.use(cors());
app.use(express.json());

/** Simple health check for Week 2 scaffolding */
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "utopiax-api",
    week: 2,
    note: "Scaffold only — auth/CMS come later",
  });
});

/**
 * Read-only content endpoint.
 * Client still uses local content.json for now; this proves the API path.
 */
app.get("/api/content", async (_req, res) => {
  try {
    const raw = await readFile(CONTENT_PATH, "utf8");
    res.type("application/json").send(raw);
  } catch (err) {
    console.error("Failed to read content.json", err);
    res.status(500).json({ error: "Could not load content" });
  }
});

app.listen(PORT, () => {
  console.log(`UtopiaX API listening on http://localhost:${PORT}`);
});
