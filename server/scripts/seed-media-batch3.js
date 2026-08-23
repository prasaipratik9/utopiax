/**
 * One-time batch insert of 4 known podcast items (batch 3).
 * INSERT only — no ALTER, UPDATE, or DELETE.
 *
 * Usage (from repo root): node server/scripts/seed-media-batch3.js
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
    title: "PepTalks with triiyo - Navigating the Future of Work",
    type: "podcast",
    category: "Podcast",
    published_at: null,
    excerpt: "Featuring Christina Gerakiteys, Co-CEO, SingularityU Australia.",
    url: null,
    thumbnail_url: "/images/peptalks-ep01.png",
    is_published: true,
    is_featured: false,
  },
  {
    title:
      "She's The Boss Leaders - Christina Gerakiteys, Co-CEO of SingularityU & Founder of UtopiaX",
    type: "podcast",
    category: "Spotify",
    published_at: null,
    excerpt:
      "Christina Gerakiteys joins She's The Boss Leaders to discuss leadership, innovation, and founding UtopiaX.",
    url: null,
    thumbnail_url: "/images/shes-the-boss-podcast.png",
    is_published: true,
    is_featured: false,
  },
  {
    title: "How Thinking Differently Impacts Team Performance",
    type: "podcast",
    category: "Inspired For Impact",
    published_at: null,
    excerpt: "Ep. 03 of Inspired For Impact, UtopiaX's podcast.",
    url: null,
    thumbnail_url: "/images/inspired-for-impact-ep03.png",
    is_published: true,
    is_featured: false,
  },
  {
    title: "Empowering Women and Redefining Business Success",
    type: "podcast",
    category: "Inspired For Impact",
    published_at: null,
    excerpt: "Ep. 13 of Inspired For Impact, UtopiaX's podcast.",
    url: null,
    thumbnail_url: "/images/inspired-for-impact-ep13.png",
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
