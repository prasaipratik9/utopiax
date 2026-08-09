import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { authMode, verifyAdmin } from "./auth.js";
import { contentStoreMode, getContent, saveContent } from "./contentStore.js";
import { isDbConfigured } from "./db.js";

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".env") });
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env") });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = path.resolve(__dirname, "../client/src/data/content.json");
const PORT = Number(process.env.PORT) || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "utopiax-dev-secret-change-me";
const SESSION_HOURS = Number(process.env.SESSION_HOURS) || 24;

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

function signToken(username) {
  return jwt.sign({ sub: username, role: "admin" }, JWT_SECRET, {
    expiresIn: `${SESSION_HOURS}h`,
  });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Missing auth token" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "utopiax-api",
    week: 2,
    db: contentStoreMode(),
    auth: authMode(),
    supabaseConfigured: isDbConfigured(),
    features: ["jwt-auth", "content-read", "content-write", "supabase-optional"],
  });
});

app.post("/api/auth/login", async (req, res) => {
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");

  try {
    const admin = await verifyAdmin(username, password);
    if (!admin) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = signToken(admin.username);
    return res.json({
      token,
      user: { username: admin.username, role: "admin" },
      expiresInHours: SESSION_HOURS,
      authMode: authMode(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Login failed" });
  }
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({
    user: { username: req.user.sub, role: req.user.role },
    authMode: authMode(),
  });
});

app.get("/api/content", async (_req, res) => {
  try {
    const result = await getContent(CONTENT_PATH);
    res.json({
      ...result.content,
      _meta: {
        source: result.source,
        updatedAt: result.updatedAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not load content" });
  }
});

app.put("/api/content", requireAuth, async (req, res) => {
  const body = { ...(req.body || {}) };
  delete body._meta;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Content body must be a JSON object" });
  }

  try {
    const result = await saveContent(CONTENT_PATH, body, req.user.sub);
    res.json({
      ok: true,
      savedAt: result.savedAt,
      source: result.source,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not save content" });
  }
});

app.listen(PORT, () => {
  console.log(`UtopiaX API on http://localhost:${PORT}`);
  console.log(`Content store: ${contentStoreMode()} | Auth: ${authMode()}`);
});
