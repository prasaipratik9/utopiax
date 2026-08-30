/**
 * One-time batch insert of 16 known service items (batch 1).
 * INSERT only — no ALTER, UPDATE, or DELETE.
 *
 * Usage (from repo root): node server/scripts/seed-services-batch1.js
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
    title: "SingularityU Australia Summit",
    brand: "openmindx",
    tag: "Summit",
    description: "Top speakers on exponentially accelerating technologies.",
    sort_order: 0,
    is_published: true,
  },
  {
    title: "Creativity, Innovation & Business 101",
    brand: "openmindx",
    tag: "International",
    description: "Encourage teams to think creatively, Find the Gaps, and innovate.",
    sort_order: 1,
    is_published: true,
  },
  {
    title: "Don't Ask Don't Get - The Science Of Askology",
    brand: "openmindx",
    tag: "International",
    description: "Embed Askology into your daily behaviours for success.",
    sort_order: 2,
    is_published: true,
  },
  {
    title: "Design Thinking Workshops (mobile - we come to you)",
    brand: "ideationworx",
    sort_order: 0,
    is_published: true,
  },
  {
    title: "Design Thinking Bootcamp - Newcastle",
    brand: "ideationworx",
    sort_order: 1,
    is_published: true,
  },
  {
    title: "Your Relevant Future - 7 workshops over 6 months",
    brand: "ideationworx",
    sort_order: 2,
    is_published: true,
  },
  {
    title: "Innovation X-Change & student exchange programs",
    brand: "ideationworx",
    sort_order: 3,
    is_published: true,
  },
  {
    title: "Unleash Possibility",
    brand: "lumierex",
    tag: "Philippines",
    location: "Philippines",
    status_label: "Bookings open",
    cta_label: "Enquire",
    description:
      "For those with fire in their belly. Village Empowerment Programs for legacy through serving others.",
    sort_order: 0,
    is_published: true,
  },
  {
    title: "Unlocking Creativity & Innovation",
    brand: "lumierex",
    tag: "Greece",
    location: "Ithaca, Greece",
    status_label: "Expressions of interest",
    cta_label: "Expressions of interest",
    description: "Amplify potential, leadership, collaboration - reset with yoga.",
    sort_order: 1,
    is_published: true,
  },
  {
    title: "SingularityU Australia Global Impact Challenge",
    brand: "openmindx",
    tag: "Challenge",
    location: "Australia",
    status_label: "Applications open",
    description:
      "What moonshot can you imagine that would solve a global grand challenge using exponential technology?",
    sort_order: 3,
    is_published: true,
  },
  {
    title: "Leadership X-Change",
    brand: "ideationworx",
    tag: "Program",
    location: "Newcastle",
    status_label: "Enquiries welcome",
    description:
      "Examine what kind of leader you are and how you best serve family, organisation, and planet.",
    sort_order: 4,
    is_published: true,
  },
  {
    title: "ExpONEntial - The Road To Infinity",
    brand: "openmindx",
    tag: "Keynote",
    location: "International",
    status_label: "Keynote",
    description: "We are drivers and reactors to change. What if we fearlessly embraced it?",
    sort_order: 4,
    is_published: true,
  },
  {
    title: "The 'I' Behind The WHY",
    brand: "openmindx",
    tag: "Keynote",
    location: "International",
    status_label: "Keynote",
    description: "Finding purpose and inspiring impact in an age of passion and meaning.",
    sort_order: 5,
    is_published: true,
  },
  {
    title: "Global Impact: A Future by Design",
    brand: "openmindx",
    tag: "Event",
    location: "Breakfast event",
    status_label: "Community",
    description: "Biotech, agtech, fintech, medtech, AI - from the SingularityU community.",
    sort_order: 6,
    is_published: true,
  },
  {
    title: "Find Your Why",
    brand: "ideationworx",
    tag: "Workshop",
    location: "Workshop",
    status_label: "Start With Why",
    description:
      "Your Why is the benchmark for everything you do - individual or organisation.",
    sort_order: 5,
    is_published: true,
  },
  {
    title: "Innovation Student X-Change",
    brand: "ideationworx",
    tag: "Exchange",
    location: "Newcastle · Reno · East Coast USA",
    status_label: "Enquire now",
    description:
      "Entrepreneurship exchange between University of Newcastle and University of Nevada.",
    sort_order: 6,
    is_published: true,
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
      .from("services")
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
      .from("services")
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
