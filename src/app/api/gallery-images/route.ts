import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const ALLOWED_EXTENSIONS = new Set([".jpeg", ".jpg", ".png", ".webp"]);
const EXCLUDED_FILES = new Set([
  "ESBK.png",
  "johi-logo.png",
  "hero-racer.jpg",
  "save.jpg",
  "arrc-2026-regulations.png",
]);
const EXCLUDED_SUBSTRINGS = ["/part/", "/card/", "/images/", "/Calendar/"];

function getImageFiles(dir: string): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const results: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getImageFiles(fullPath));
    } else if (ALLOWED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      if (!EXCLUDED_FILES.has(entry.name)) {
        const relative = fullPath.replace(PUBLIC_DIR + path.sep, "").replace(/\\/g, "/");
        if (!EXCLUDED_SUBSTRINGS.some((s) => relative.includes(s))) {
          results.push(relative);
        }
      }
    }
  }
  return results;
}

export async function GET() {
  try {
    const files = getImageFiles(PUBLIC_DIR);
    files.sort();
    const images = files.map((src) => ({
      src: "/" + src,
      alt: src.replace(/\\/g, "/").split("/").pop() || src,
    }));
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}
