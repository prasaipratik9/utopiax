import { readFile, writeFile } from "node:fs/promises";
import { getSupabase, isDbConfigured } from "./db.js";

const ROW_ID = 1;

export async function getContent(filePath) {
  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("site_content")
      .select("data, updated_at")
      .eq("id", ROW_ID)
      .maybeSingle();

    if (error) {
      console.error("Supabase content read failed:", error.message);
      throw new Error("Could not load content from database");
    }

    if (data?.data) {
      return {
        content: data.data,
        source: "supabase",
        updatedAt: data.updated_at || null,
      };
    }

    // First run: seed DB from local file
    const seeded = await readFileContent(filePath);
    await saveContent(filePath, seeded, "system-seed");
    return {
      content: seeded,
      source: "supabase-seeded",
      updatedAt: new Date().toISOString(),
    };
  }

  const content = await readFileContent(filePath);
  return { content, source: "file", updatedAt: null };
}

export async function saveContent(filePath, content, updatedBy = "admin") {
  const supabase = getSupabase();
  const savedAt = new Date().toISOString();

  if (supabase) {
    const { error } = await supabase.from("site_content").upsert({
      id: ROW_ID,
      data: content,
      updated_at: savedAt,
      updated_by: updatedBy,
    });

    if (error) {
      console.error("Supabase content write failed:", error.message);
      throw new Error("Could not save content to database");
    }

    // Keep local file in sync for Vite seed / offline fallback
    try {
      await writeFile(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
    } catch (err) {
      console.warn("Saved to DB but could not sync content.json:", err.message);
    }

    return { source: "supabase", savedAt };
  }

  await writeFile(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  return { source: "file", savedAt };
}

async function readFileContent(filePath) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export function contentStoreMode() {
  return isDbConfigured() ? "supabase" : "file";
}
