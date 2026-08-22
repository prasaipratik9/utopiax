/**
 * One-time batch insert of 5 known media items (batch 1).
 * INSERT only — no ALTER, UPDATE, or DELETE.
 *
 * Usage (from repo root): node server/scripts/seed-media-batch1.js
 */
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSupabase, isDbConfigured } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(serverRoot, ".env") });
dotenv.config({ path: path.join(serverRoot, "../.env") });

function slugify(title) {
  return String(title || "")
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const ROWS = [
  {
    title: "SingularityU Australia Summit - Opening Keynote",
    type: "video",
    category: "Innovation",
    published_at: "2025-02-01",
    excerpt:
      "Christina on exponential technologies, human-centred change, and what leaders can do now.",
    url: null,
    thumbnail_url: null,
    is_published: true,
    is_featured: false,
  },
  {
    title: "The Science of Askology - Podcast",
    type: "podcast",
    category: "Leadership",
    published_at: "2024-12-01",
    excerpt:
      "A conversation on embedding bold asks into culture, boards, and entrepreneurial teams.",
    url: null,
    thumbnail_url: null,
    is_published: true,
    is_featured: false,
  },
  {
    title: "Vision and Values are More Than Rhetoric",
    type: "article",
    category: "Innovation",
    published_at: "2024-05-08",
    excerpt:
      "Working in the 'purpose' space doesn't mean you continually celebrate success. It does ensure the failures are continuous stepping stones to success.",
    content: null,
    thumbnail_url: null,
    is_published: true,
    is_featured: false,
  },
  {
    title: "A Family Legacy of Failure and Success",
    type: "article",
    category: "Innovation",
    published_at: "2024-05-13",
    excerpt:
      "A monumental failure is a monumental lesson. Failure is not a closed door to success. Unless nothing is learnt.",
    content: null,
    thumbnail_url: null,
    is_published: true,
    is_featured: false,
  },
  {
    title: "Leadership Weekly - Cover Story",
    type: "press",
    category: "Press",
    published_at: "2024-06-01",
    excerpt:
      "Profile on navigating uncertainty with practical foresight and a bias toward action.",
    url: null,
    thumbnail_url: null,
    is_published: true,
    is_featured: false,
  },
];

async function main() {
  if (!isDbConfigured()) {
    console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in server/.env");
    process.exit(1);
  }

  const supabase = getSupabase();

  for (const row of ROWS) {
    const slug = slugify(row.title);

    const { data: existing, error: lookupError } = await supabase
      .from("media")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (lookupError) {
      console.error(`Lookup failed for "${row.title}":`, lookupError.message);
      process.exit(1);
    }

    if (existing) {
      console.log(`Skip (slug exists): ${row.title} → ${slug}`);
      continue;
    }

    const { error: insertError } = await supabase
      .from("media")
      .insert({ ...row, slug });

    if (insertError) {
      console.error(`Insert failed for "${row.title}":`, insertError.message);
      process.exit(1);
    }

    console.log(`Inserted: ${row.title} → ${slug}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
