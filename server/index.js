import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { authMode, verifyAdmin } from "./auth.js";
import { contentStoreMode, getContent, saveContent } from "./contentStore.js";
import { isDbConfigured } from "./db.js";
import { requireAuth } from "./middleware/requireAuth.js";
import analyticsRouter from "./routes/analytics.js";
import enquiriesRouter from "./routes/enquiries.js";
import mediaRouter from "./routes/media.js";
import newsletterRouter from "./routes/newsletter.js";
import productsRouter from "./routes/products.js";
import servicesRouter from "./routes/services.js";
import usersRouter from "./routes/users.js";

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

function signToken(username, role = "admin") {
  return jwt.sign({ sub: username, role }, JWT_SECRET, {
    expiresIn: `${SESSION_HOURS}h`,
  });
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "utopiax-api",
    week: 2,
    db: contentStoreMode(),
    auth: authMode(),
    supabaseConfigured: isDbConfigured(),
    features: [
      "jwt-auth",
      "content-read",
      "content-write",
      "supabase-optional",
      "services",
      "products",
      "media",
      "enquiries",
      "newsletter",
      "analytics",
      "users",
    ],
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

    const role = admin.role || "admin";
    const token = signToken(admin.username, role);
    return res.json({
      token,
      user: { username: admin.username, role },
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

// Relational resources (require Supabase — see schema-core.sql)
app.use("/api/services", servicesRouter);
app.use("/api/products", productsRouter);
app.use("/api/media", mediaRouter);
app.use("/api/enquiries", enquiriesRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`UtopiaX API on http://localhost:${PORT}`);
  console.log(`Content store: ${contentStoreMode()} | Auth: ${authMode()}`);
});
