/**
 * One-time batch insert of 10 known media items (batch 2).
 * INSERT only — no ALTER, UPDATE, or DELETE.
 *
 * Usage (from repo root): node server/scripts/seed-media-batch2.js
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
    title: "Vivid Ideas - Dream Out Loud",
    type: "article",
    category: "Creativity",
    published_at: "2025-01-01",
    excerpt:
      "Why imagination is the first technology - and how teams can practice moonshot thinking daily.",
    content: null,
    thumbnail_url: null,
    is_published: true,
    is_featured: false,
  },
  {
    title: "Creative Innovation Global - Panel Recap",
    type: "video",
    category: "Events",
    published_at: "2024-11-01",
    excerpt:
      "Highlights from the international panel on tech ethics, foresight, and responsible innovation.",
    url: null,
    thumbnail_url: null,
    is_published: true,
    is_featured: false,
  },
  {
    title: "Design Thinking in the Enterprise",
    type: "article",
    category: "Workshops",
    published_at: "2024-10-01",
    excerpt:
      "Practical protocols for customer-centric problem solving inside large bureaucracies.",
    content: null,
    thumbnail_url: null,
    is_published: true,
    is_featured: false,
  },
  {
    title: "Factor X - Fireside Chat",
    type: "podcast",
    category: "Entrepreneurship",
    published_at: "2024-09-01",
    excerpt:
      "Purpose, passion, and the 'I' behind your why - audio from a leadership retreat series.",
    url: null,
    thumbnail_url: null,
    is_published: true,
    is_featured: false,
  },
  {
    title: "Hunter Innovation Festival - Behind the Scenes",
    type: "video",
    category: "Community",
    published_at: "2024-08-01",
    excerpt:
      "Producing a regional innovation festival: partnerships, stages, and stories that stuck.",
    url: null,
    thumbnail_url: null,
    is_published: true,
    is_featured: false,
  },
  {
    title: "Global Impact Challenge - Founder Interview",
    type: "article",
    category: "Innovation",
    published_at: "2024-07-01",
    excerpt:
      "What moonshot ideas need at the earliest stage - mentorship, metrics, and momentum.",
    content: null,
    thumbnail_url: null,
    is_published: true,
    is_featured: false,
  },
  {
    title: "PCOC Keynote - ExpONEntial Futures",
    type: "video",
    category: "Keynotes",
    published_at: "2024-05-01",
    excerpt:
      "We are drivers and reactors to change - reframing fear into fuel for transformation.",
    url: null,
    thumbnail_url: null,
    is_published: true,
    is_featured: false,
  },
  {
    title: "Innovation Mindsets - Audio Series Ep. 1",
    type: "podcast",
    category: "Ideation",
    published_at: "2024-04-01",
    excerpt:
      "Introducing the mindsets that help teams move from ideas to experiments faster.",
    url: null,
    thumbnail_url: null,
    is_published: true,
    is_featured: false,
  },
  {
    title: "Tech Insight Daily - Guest Column",
    type: "article",
    category: "Trends",
    published_at: "2024-03-01",
    excerpt:
      "Three signals every board should watch in the fourth industrial revolution.",
    content: null,
    thumbnail_url: null,
    is_published: true,
    is_featured: false,
  },
  {
    title: "Nobody Knows Anything",
    type: "article",
    category: "Innovation",
    published_at: "2024-05-12",
    excerpt: "How do you know if it's going to work? The truth is, we never know. Not for sure.",
    content: null,
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
